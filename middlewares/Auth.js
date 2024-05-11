const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async(req,res,next) => {

    try{

        const Token = req.headers['authorization'];
        
        if(!Token){
            return res.status(401).json({
                success : false,
                message : "Token Not Found"
            });
        }

        const token = Token.split(' ')[1];

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();

    }catch(err){
        console.log(err);
        return res.status(401).json({
            success : false,
            message : "Authentication Failed",
            error : err.message
        });
    }

}