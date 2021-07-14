const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log('Database connected');
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60e754062a0b5a0c68223686',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'A summer camp or sleepaway camp is a supervised program for children or teenagers conducted during the summer months in some countries. Children and adolescents who attend summer camp are known as campers. A summer camp environment may allow children to learn new skills in a safe and nurturing environment.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhritishman22/image/upload/v1626121891/YelpCamp/cmqdfs5r5tgmtvs62x4c.jpg',
                    filename: 'YelpCamp/cmqdfs5r5tgmtvs62x4c'
                  },
                  {
                    url: 'https://res.cloudinary.com/dhritishman22/image/upload/v1626121891/YelpCamp/azx9potm9svvaavhas1y.jpg',
                    filename: 'YelpCamp/azx9potm9svvaavhas1y'
                  },
                  {
                    url: 'https://res.cloudinary.com/dhritishman22/image/upload/v1626121891/YelpCamp/ykyuzp1mphxvbo3q1p5c.jpg',
                    filename: 'YelpCamp/ykyuzp1mphxvbo3q1p5c'
                  }               
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});