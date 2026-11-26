const User = require('../models/user')
const jwt = require('jsonwebtoken')


//function protecting routes from unauthorized access

const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwt

    if(token){
    jwt.verify(token,process.env.guest,async(err,decodedToken)=>{
        if(err){
            //has a token but not valid error
            console.log(err.message)
            res.redirect('/login')
        }else{
            console.log(decodedToken)
            res.redirect('/')
            next()
        }
    })
    }else{
        //do not have a token
        res.redirect('/login')
    }
}

const requireIfAuthenticated = (req,res,next) =>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.guest,(err,decodedToken)=>{
            if(err){
                next()
            }else{
                res.redirect('/')
            }
        })
    }
    else{
        next()
    }
}
const checkUser = (req,res,next) =>{
const token = req.cookies.jwt
   if(token){
    jwt.verify(token,process.env.guest,async(err,decodedToken)=>{
        if(err){
            console.log(err.message)
            res.locals.person = null
            next()
        }else{
            let user = await User.findById(decodedToken.id)
            res.locals.person = user
            next()
        }

    
    })
   }else{
   res.locals.person = null
   next()
   }
}
module.exports = {checkUser,requireAuth,requireIfAuthenticated}