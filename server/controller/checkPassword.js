// controller/checkPassword.js

const UserModel = require("../models/UserModel")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function checkPassword(request, response) {

    try {

        const { password, userId } = request.body

        // check user
        const user = await UserModel.findById(userId)

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true
            })
        }

        // verify password
        const verifyPassword = await bcryptjs.compare(password, user.password)

        if (!verifyPassword) {
            return response.status(400).json({
                message: "Please check password",
                error: true
            })
        }

        // token payload
        const tokenData = {
            id: user._id,
            email: user.email
        }

        // generate token
        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        )

        // cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        // send response
        return response
            .cookie("token", token, cookieOptions)
            .status(200)
            .json({
                message: "Login successfully",
                success: true,
                token: token,
                data: user
            })

    } catch (error) {

        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true
        })

    }
}

module.exports = checkPassword