const USER = require('../models/user')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/sendEmail')


const otp_lifetime = 10 * 60 * 1000
const resend_cooldown = 60 * 1000
const max_otp_attempts = 5



//render pages
const forgot_pass_get = (req,res) =>{
    res.render('forgot-password')
}
const reset_pass_get = (req,res) =>{
    res.render('reset-password')
}



//Generating the OTP
const forgot_pass = async(req,res)=>{
  try {
     const {forgotEmail} = req.body
   if(typeof forgotEmail !== 'string'){
    return res.status(400).json({error:'Invalid request'})
   }

   const user = await USER.findOne({email:forgotEmail.trim().toLowerCase()})

   if(user){
     const recentlySent = 
     user.resetOtpExpires && user.resetOtpExpires - Date.now() > otp_lifetime - resend_cooldown
       if(!recentlySent){
    const otp = crypto.randomInt(100000,1000000).toString()

    user.resetOtp = await bcrypt.hash(otp,10)
    user.resetOtpExpires = Date.now() + otp_lifetime
    user.resetAttempts = 0

    await user.save() 

    await sendEmail(
        user.email,
        'Your password reset code',
        `Your OTP code is ${otp}.It expires in 10 miniutes.Ignore if you did not request`
    )
   
   }
   }

 res.json({message:'If email exist, an OTP has been sent'})


  } catch (error) {
    res.status(500).json({error:'Server error'})
  }
}
//verifying the otp generated
const reset_pass = async() =>{
    const {otpInput,email,newPass,confirmPass} = req.body

    if(typeof email !== 'string' || !otpInput){
        res.status(400).json({error:'Invalid email or OTP'})
    }
    if(typeof newPass !== 'string' || newPass.length < 6){
        res.status(400).json({error:'Invalid password'})
    }
    if(newPass !== confirmPass){
        res.status(400).json({error:'password do not match'})
    }

    const user = await USer.findOne({email:email.trim().toLowerCase()})

    if(!user || !user.resetOtp || user.resetOtpExpires < Date.now()|| 
user.resetAttempts >= max_otp_attempts){
    res.status(400).json({messge:'Invalid or expired OTP'})
}
const otpMatch = await bcrypt.compare(String(otp),user.resetOtp)
if(!otpMatch){
    user.resetAttempts += 1
    await user.save()
    res.status(400).json({message:'Invalid or expired OTP'})
}
 //assigning the new password to the password variable in the user/model
user.password = newPass
user.resetOtp = undefined
user.resetAttempts = 0
user.resetExpires = undefined

await user.save()
res.status(200).json({message:'password reset was successful'})
}

module.exports = {forgot_pass,reset_pass,
    forgot_pass_get,reset_pass_get}