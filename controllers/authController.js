const express = require('express')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//rendering pages
const home_get = (req,res)=>{
    res.render('home')
}
const login_get = (req,res)=>{
    // if(res.locals.person){
    //     res.redirect('/')
    // }
    res.render('login')
}
const signup_get = (req,res)=>{
    res.render('signup')
}

//custom error handling function

const errorHandler = (err)=>{
   console.log(err.message,err.code)
   const errors = {firstname: '',lastname:'',email: '',password:''}

   //login errors
   if(err.message === 'Incorrect email'){
     errors.email = 'email is not registered'
   }
   if(err.message === 'Incorrect password'){
    errors.password = 'Incorrect password'
   }
    

   //signup errors
   if(err.message.includes('user validation failed')){
   Object.keys(err.errors).forEach((key)=>{
    errors[key] = err.errors[key].message
   })
   //console.log(Object.keys(err.errors))
}
   return errors
}
const maxAge = 24 * 60 * 60 
const createToken = (id)=>{
return jwt.sign({id},process.env.guest,{expiresIn:maxAge})
}
//api's to the db
const signup_post = async(req,res) =>{
//     console.log('Content-Type:', req.headers['content-type']);
//   console.log('Raw Body:', req.body);
   const {firstname,lastname,email,password} = req.body
    

   try {
    const user = await userModel.create({
        firstname,
        lastname,
        email,
        password});
     res.status(200).json({user:user._id})
   } catch (error) {
    console.log(`Sorry! Something happened:`,error.message)
    const errors = errorHandler(error)
   // errorHandler(error) 
    res.status(400).json({errors})
   // res.status(400).json({error: error.message})
   }
}

const login_post = async(req,res) =>{
    const {email,password} = req.body
    try {
        
        const user = await userModel.login({email,password})
        const token = createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge * 1000})
        res.status(200).json({message:'Login successful',userId: user._id})
    } catch (error) {
        const errors = errorHandler(error)
        console.log(error.message)
        res.status(401).json({errors})
    }
}

const logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/login')
}

module.exports = {home_get,logout_get,
    login_get,signup_get,signup_post,login_post}