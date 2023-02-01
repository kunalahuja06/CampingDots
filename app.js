if(process.env.NODE_ENV!= "production"){
    require('dotenv').config()
}

const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const Campground=require('./models/campground')
const User=require('./models/user')
const ExpressError=require('./utils/ExpressError')
const WrapAsync=require('./utils/WrapAsync')
const joi=require('joi')
const {campgroundSchema, reviewSchema}=require('./schemas.js')
const ejsMate=require('ejs-mate')
const session=require('express-session');
const flash= require('connect-flash')
const MethodOverride=require('method-override')
const passport=require('passport')
const passportLocal=require('passport-local')
const app=express()
const campgroundRoute=require('./routes/campground')
const reviewRoute=require('./routes/review')
const userRoute=require('./routes/users')
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet')
const MongoStore = require("connect-mongo");


// || 'mongodb://localhost:27017/yelp-camp'
const dbUrl='mongodb+srv://KunalAhuja:Admin%40Kunal06@cluster0.dkpvo.mongodb.net/campingdots?retryWrites=true&w=majority&'
// mongoose.connect(dbUrl, {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:false,})
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Dataase Up and running")
// });

require("dotenv").config();
const uri ='mongodb+srv://KunalAhuja:Admin%40Kunal06@cluster0.dkpvo.mongodb.net/campingdots?retryWrites=true&w=majority&'
mongoose
  .connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });


const secret= 'thisisasecret'

const store=new MongoStore({
    mongoUrl:uri,
    secret: 'thisisasecret',
    touchAfter: 24*60*60
    
});
store.on("error",function(e){
    console.log(e)
})

const sessionConfig={
    store,
    secret,
    //secure:true,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(session(sessionConfig))
app.use(flash());
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(helmet({contentSecurityPolicy:false}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
 
app.use((req,res,next)=>{
    res.locals.currentUser=req.user

    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
 })

app.use(express.urlencoded({extended:true}))
app.use(MethodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)
app.use('/',userRoute)

app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})



app.use((err,req,res,next)=>{
    const { statuscode=500}=err;
    if(!err.message){
        err.message='We ran into an error';
    }
    res.status(statuscode).render('error',{err})
})
const port=process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Connected on port ${port}`)
})