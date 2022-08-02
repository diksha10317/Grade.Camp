const express=require('express')
const router=express.Router()
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const campground=require('../controllers/campgrounds')
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage})

const  {isLoggedIn,isAuthor,validateCampground}=require('../middleware.js')

router.route('/')
      .get(catchAsync(campground.index))
      .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.create))
      // .post(upload.array('image'),(req,res)=>{
      //    console.log(req.body,req.files)
      //     res.send('it worked')
      // })

router.get('/new',isLoggedIn,campground.renderNewForm)

router.route('/:id')
       .get(catchAsync(campground.showCampground))
       .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
       .delete(isLoggedIn,isAuthor,catchAsync(campground.delete))




router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))




module.exports=router;