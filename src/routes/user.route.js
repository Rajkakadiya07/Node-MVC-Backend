const express = require('express');
const { inserUser, loginUser, logoutUser } = require('../controllers/user.controller');
const { upload } = require('../middlewares/multer.middleware');
const { verifyJWT } = require('../middlewares/auth.middleware');
const userRouter = express.Router();

userRouter.post("/insert-user",upload.single("avatar") ,inserUser);
userRouter.post("/login", loginUser);

// secure Route
userRouter.post("/logout", verifyJWT, logoutUser)

module.exports={userRouter}