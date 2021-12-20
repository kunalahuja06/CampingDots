const express=require('express')
const router=express.Router()
const Campground=require('../models/campground')
const WrapAsync=require('../utils/WrapAsync')
const {isLoggedIn, isAuthor, validateCampground}=require('../middleware')
const multer=require('multer')
const {storage, cloudinary}=require('../cloudinary')
const upload= multer({storage})
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken=process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken:mbxToken})



router.get('/',async (req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

router.get('/mycampgrounds', async (req,res)=>{
    const campgrounds= await Campground.find({'author':req.user.id})
    res.render('campgrounds/mycampgrounds',{campgrounds})
})

router.post('/',isLoggedIn,upload.array('image'),validateCampground,WrapAsync(async(req,res,next)=>{
   const geodata=await  geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground=new Campground(req.body.campground)
    campground.geometry=geodata.body.features[0].geometry
    campground.images=req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.author= req.user._id
    await campground.save();
    req.flash('success', 'new campground created');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id',WrapAsync(async (req,res)=>{
    const campground= await Campground.findById(req.params.id).populate(
        {
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','cannot find the campground you are looking for! ')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit',isLoggedIn,isAuthor,WrapAsync(async(req,res)=>{
    const campground= await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','cannot find the campground you are looking for! ')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground,WrapAsync(async(req,res)=>{
    const{id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{ ...req.body.campground})
    const imgs=req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
        // console.log(campground)
    }
    req.flash('success', 'successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn,isAuthor,WrapAsync(async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'campground deleted!');
    res.redirect('/campgrounds')
}))

module.exports=router