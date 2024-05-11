const mongoose = require("mongoose");
const {mailSender} = require("../utils/mailSender");
const {otpTemplate} = require("../emailTemplates/verifyMail");

const otpSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : String , 
        required : true
    },
    createdAt : {
        type : Date , 
        default  :Date.now(),
        expires : 10*60
    }
});

const sendVerificationMail = async(email , otp) => {
    try{
        await mailSender(email , "Verification Mail" , otpTemplate(otp));
        console.log("Mail Sent");
    }catch(err){
        console.log(err);
        throw err;
    }
}

otpSchema.pre("save" , async function(next){

    if(this.isNew){
        await sendVerificationMail(this.email , this.otp);
    }
    next()
    
});



module.exports = mongoose.model("Otp" , otpSchema);