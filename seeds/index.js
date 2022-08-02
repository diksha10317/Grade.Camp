const mongoose = require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {first,second}=require('./seedhelper')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser:true,
useUnifiedTopology:true
});

const db=mongoose.connection;
db.on("error",console.error.bind("connection failed"));
db.once("open",() => {
   console.log('database connected')
});
 const ran1=(array)=>array[Math.floor(Math.random()*array.length)];
const fun=async ()=>{
    await Campground.deleteMany({});

    for(let i=0;i<50;i++)
    {
        let ran=Math.floor(Math.random()*50)
        const price=Math.floor(Math.random()*100)+200
       let camp=new Campground({
          title:`${ran1(first)} ${ran1(second)}`,
          location:`${cities[ran].city},${cities[ran].admin_name}`,
          author:'62dfe7d142bd348422d00cf2',
          geometry:{
             type : "Point", 
             coordinates: [ cities[ran].lng, cities[ran].lat ] 
          },
          images: [
            
              {
                url: 'https://res.cloudinary.com/dikshajha2000/image/upload/v1659208695/yelpCamp/plcqwvjw3y1o5byio7uh.jpg',
                filename: 'yelpCamp/plcqwvjw3y1o5byio7uh',
                
              },
              {
                url: 'https://res.cloudinary.com/dikshajha2000/image/upload/v1659208703/yelpCamp/h1zwkqdbvpm0nunhr0nu.jpg',
                filename: 'yelpCamp/h1zwkqdbvpm0nunhr0nu',
               
              }
            
          ],
        
          description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dignissimos voluptatem, a libero officia adipisci aspernatur quasi, delectus aliquid maiores eveniet quae earum vero cum eum sit qui hic. Consequatur.",
          price
         })
       
       await camp.save();
    }
}
 fun().then(()=>{
    mongoose.connection.close()
 }
 )
