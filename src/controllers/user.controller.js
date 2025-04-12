const { userModel } = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generaterefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong!")
    }
}

const inserUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are Required");
    }

    const checkUser = await userModel.findOne({
        $or: [{ username }, { email }]
    })


    if (checkUser) {
        throw new ApiError(409, "User Already Exist");
    }

    // const avatarPath = req.files?.avatar[0]?.path;
    const avatarPath = req.file?.path;

    if (!avatarPath) {
        throw new ApiError(400, "Avatar file required")
    }

    const avatar = await uploadOnCloudinary(avatarPath);

    if (!avatar) {
        throw new ApiError(400, "Cloudinary upload failed");
    }
    console.log("Avatar Path:", avatarPath);

    const userData = new userModel({
        username,
        email,
        password,
        // avatar: avatarPath
        avatar: avatar.url

    })
    const response = await userData.save();

    const createdUser = userModel.findById(response._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, response, "User registered Successfully")
    );

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received body:", req.body);


    if (!email && !username) {
        throw new ApiError(400, "Username or Email is required");
    }
    

    const user = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await userModel.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accessToken, refreshToken
                },
                "User Logged in success"
            )
        )

})


const logoutUser = asyncHandler(async (req, res) => {
    await userModel.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged Out"))
})

module.exports = { inserUser, loginUser, logoutUser }