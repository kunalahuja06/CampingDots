const express=require('express')
const router=express.Router({mergeParams:true})
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware')
const Campground=require('../models/campground')
const reviews=require('../controllers/reviews')
const Review=require('../models/review')
const WrapAsync=require('../utils/WrapAsync')



router.post('/',isLoggedIn,validateReview, WrapAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor,WrapAsync(reviews.deleteReview))

module.exports=router