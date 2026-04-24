import UserModel from "../model/user.model.js"

const generateToken = async (user) => {
    try {
         const accessToken = generateToken(user)
         const refreshToken = generateRefreshToken(user) 


         return {accessToken,refreshToken}
    }catch (error) {
        throw new Error("Error generating token")
    }
}

const updateRefreshToken = async (userId,refreshToken) => {
   await UserModel.findByIdAndUpdate(userId,{refreshToken:refreshToken})
}

const clearRefreshToken = async (userId) => {
    return await UserModel.findByIdAndUpdate(userId,{refreshToken:""})
}

const getCookieOptions = () => {
    return {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    }
}

export {generateToken,clearRefreshToken,getCookieOptions,updateRefreshToken}       
