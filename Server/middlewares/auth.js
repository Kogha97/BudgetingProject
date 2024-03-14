import jwt  from "jsonwebtoken";

export default function auth (req, res, next) {
    try {
        const token = req.cookies.userCookie
        // console.log("🚀 ~ auth ~ token:", token)
        const decoded = jwt.verify(token, process.env.SECRET)
        req.user = decoded.id;
        next();
    } catch (error) {
        console.log("🚀 ~ auth ~ error:", error.message)
        return res.send({sucess: false, error: error.message})
        
    }
}