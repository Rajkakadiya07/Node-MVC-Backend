const { userModel } = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require('jsonwebtoken')


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = await jwt.verify(token, process.env.S_KEY)
    
        const user = await userModel.findById(decodedToken?._id).select("-password -rereshToken");
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Token")
        
    }
})

module.exports ={verifyJWT}