const express=require('express')
const User=require('../models/user')
const users=require('../controllers/users')
// const passport=require('passport')
const router=express.Router()

const ExpressError=require('../utils/ExpressError')
const WrapAsync=require('../utils/WrapAsync')
const passport = require('passport')

router.route('/register')
    .get(users.registerForm)
    .post(WrapAsync(users.register))

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login)

router.get('/logout',users.logout)

module.exports=router