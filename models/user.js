const mongoose = require('mongoose')
const { timeStamp } = require('node:console')
const { type } = require('node:os')
const { default: isEmail } = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')


const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'enter a name']
    },
    lastname:{
        type:String,
        required:[true,'enter a name'],
    },
    email:{
        type:String,
        required:[true,'enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'enter a valid email']
    },
    password:{
        type:String,
        required:[true,'enter a password'],
        minlength:[8,'It should be 8 letters minimum'],
    },
     resetOtp:String,
     resetOtpExpires: Date,
     resetAttempts:{
        type:Number,
        default:0
     }
},{timestamp:true
 })




//a hook to hash the password before it gets to the db
userSchema.pre('save',async function() {
 const salt = await bcrypt.genSalt()
 this.password =  bcrypt.hash(this.password,salt)
})

//the login method 
userSchema.statics.login = async function({email,password}) {
    const user = await this.findOne({email})
    if(user){
        
    const auth = await bcrypt.compare(password,user.password)
    if(auth){
       return user
    }
     throw new Error('Incorrect password')
} 
throw new Error('Incorrect email')
}
const USER = mongoose.model('user',userSchema)
module.exports = USER