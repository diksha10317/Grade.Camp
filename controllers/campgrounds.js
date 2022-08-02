const Campground=require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken=process.env.MAPBOX_TOKEN;
 const geocoder=mbxGeocoding({accessToken:mapboxToken})
const {cloudinary}=require('../cloudinary')


module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.create=async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
   
    
     
     const campground=new Campground(req.body.campground);
     campground.geometry=geoData.body.features[0].geometry;
      campground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
     campground.author=req.user._id;
    await campground.save();
    
     req.flash('success','Sucsesfully made a Campground')
     res.redirect(`/campgrounds/${campground._id}`)
    }

module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }})
        .populate('author')
    if(!campground)
    {
        req.flash('error','Campground not found')
        res.redirect('/campgrounds')
    }
  
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm=async(req,res)=>{
    const campground= await Campground.findById(req.params.id)
    if(!campground)
    {
        req.flash('error','Campground not found')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params
  
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
      const img=req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(... img)
    await campground.save();
     //to delete images
     if(req.body.deletedImages){
        for(let filename of req.body.deletedImages){
            cloudinary.uploader.destroy(filename)
        }
     await campground.updateOne({$pull:{images:{filename:{$in:req.body.deletedImages}}}})
    
     }
    req.flash('success','Sucsesfully updated the Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete=async(req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Sucsesfully deleted a Campground')
    res.redirect('/campgrounds')
}

