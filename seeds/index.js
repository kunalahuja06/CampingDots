const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.random(Math.floor()*20)+10;
        const camp = new Campground({
            author:'612fa50bfed08a02c407e23b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro, aliquid beatae inventore adipisci vitae eos eum architecto numquam delectus fugiat eaque assumenda! Quaerat suscipit maiores recusandae rem praesentium delectus. Necessitatibus!',
            price,
            geometry :
             { type : "Point",
              coordinates: [ 
                cities[random1000].longitude,
                cities[random1000].latitude
               ],
        },
            images:[
                {
                  url: 'https://res.cloudinary.com/dgpmf9k5q/image/upload/v1631255278/yelpCamp/r7akukunm0upv5lyebwu.jpg',
                  filename: 'yelpCamp/r7akukunm0upv5lyebwu'
                },
                {
                  url: 'https://res.cloudinary.com/dgpmf9k5q/image/upload/v1631255278/yelpCamp/s5cbzuqwuldd3f4sxitz.jpg',
                  filename: 'yelpCamp/s5cbzuqwuldd3f4sxitz'
                },
                {
                  url: 'https://res.cloudinary.com/dgpmf9k5q/image/upload/v1631255279/yelpCamp/sxx8kr9hj0uxwmk6at4b.jpg',
                  filename: 'yelpCamp/sxx8kr9hj0uxwmk6at4b'
                },
                {
                  url: 'https://res.cloudinary.com/dgpmf9k5q/image/upload/v1631255279/yelpCamp/oeer2nu4jmo6nqn8eg60.jpg',
                  filename: 'yelpCamp/oeer2nu4jmo6nqn8eg60'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})