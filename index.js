const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

// middleware
app.use(express.json());
app.use(cors());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tv4qtbo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// // ::::: database :::::: 
const database = client.db('WiseStayDestination');

// // ::::: collection ::::
const roomCollection = database.collection('rooms');
const subscriptionCollection = database.collection('subscription');
const reviewCollection = database.collection('reviews');
const bookingCollection = database.collection('booking');

// ::::::::: add room ::::::::::::
// post 
app.post("/rooms", async (req, res) => {
    try {
        const body = req.body;
        const result = await roomCollection.insertOne(body);
        // console.log(result);
        res.send(result);
    } catch (err) {
        // console.log(err);
        res.send(err);
    }
})


// Get all
app.get('/rooms', async (req, res) => {
    try {
        const result = await roomCollection.find().toArray();
        res.send(result);
    } catch (err) {
        // console.log(err);
    }
})

// get one 
app.get("/rooms/:id", async (req, res) => {
    try {
        const rooms = await roomCollection.findOne({ _id: new ObjectId(req.params.id) });
        // console.log(rooms);
        res.send(rooms);
    } catch (error) {
        // console.log(error);
    }
})

// Delete 
app.delete("/rooms/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await roomCollection.deleteOne(query);
        res.send(result);
        // console.log(result)
    } catch (err) {
        // console.log(err);
    }
})

// update : Put ::::::::::::::::::
app.put("/rooms/:id", async (req, res) => {
    try {
        const id = { _id: new ObjectId(req.params.id) };
        const body = req.body;
        const updatedData = {
            $set: {
                ...body,
            },
        };
        const option = { upsert: true };
        const result = await roomCollection.updateOne(id, updatedData, option);
        // console.log(body);
        res.send(result);
    } catch (err) {
        // console.log(err);
    }
})

// :::::::::::::: Subscription :::::::::::::
// post 
app.post("/subscription", async (req, res) => {
    try {
        const body = req.body;
        const result = await subscriptionCollection.insertOne(body);
        // console.log(result);
        res.send(result);
    } catch (err) {
        // console.log(err);
        res.send(err);
    }
})

//  Get all subscription 
app.get('/subscription', async (req, res) => {
    try {
        const result = await subscriptionCollection.find().toArray();
        res.send(result);
    } catch (err) {
        // console.log(err);
    }
})

// get one 
app.get("/subscription/:id", async (req, res) => {
    try {
        const subscribe = await subscriptionCollection.findOne({ _id: new ObjectId(req.params.id) });
        // console.log(subscribe);
        res.send(subscribe);
    } catch (error) {
        // console.log(error);
    }
})



// :::::::::::::: USER REVIEW :::::::::::::
// post 
app.post("/reviews", async (req, res) => {
    try {
        const body = req.body;
        const result = await reviewCollection.insertOne(body);
        console.log(result);
        res.send(result);
    } catch (err) {
        // console.log(err);
        res.send(err);
    }
})

//  Get all reviews
app.get('/reviews', async (req, res) => {
    try {
        const result = await reviewCollection.find().toArray();
        // res.send(result);
    } catch (err) {
        // console.log(err);
    }
})

// get one 
app.get("/reviews/:id", async (req, res) => {
    try {
        const review = await reviewCollection.findOne({ _id: new ObjectId(req.params.id) });
        // console.log(review);
        res.send(review);
    } catch (error) {
        // console.log(error);
    }
})


// User Booking 

app.post("/booking", async (req, res) => {
    try {

        const body = req.body;
        const result = await bookingCollection.insertOne(body);
        console.log(result);
        res.send(result);
        // console.log(result);
        res.send(result);
    } catch (err) {
        // console.log(err);
        res.send(err);
    }
})
// get

app.get('/bookings', async (req, res) => {
    try {
        const result = await bookingCollection.find().toArray();
        res.send(result);
    } catch (err) {
        // console.log(err);
    }
})

app.get('/bookings', async (req, res) => {
    try {
      const email = req.query.email;
      const bookings = await bookingCollection.find({ userEmail: email }).toArray();
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).send('Internal Server Error');
    }
  });










// app.get('/checkRoomAvailability', (req, res) => {
//     const { roomNo, checkInDate, checkOutDate } = req.query;

//     // Convert string dates to Date objects for comparison
//     const startDate = new Date(checkInDate);
//     const endDate = new Date(checkOutDate);

//     // Check if the selected date range overlaps with any existing bookings
//     const isRoomAvailable = bookings.every((booking) => {
//       const bookedStartDate = new Date(booking.checkInDate);
//       const bookedEndDate = new Date(booking.checkOutDate);

//       return (
//         startDate >= bookedEndDate || endDate <= bookedStartDate
//       );
//     });

//     res.json({ available: isRoomAvailable });
//   });

// app.get('/booking',async(req,res)=>{
//     const cursor = bookingCollection.find();
//     const result = await cursor.toArray();
//     res.send(result);
// })
// app.get('/booking/:id',async(req,res)=>{
//     const id = req.params.id;
//     const query = {_id: new ObjectId(id)}
//     const options = {
//         projection : {title:1, price:1,},
//     };
//     const result = await bookingCollection.findOne(query,options);
//     res.send(result)
// })


app.get('/', (req, res) => {
    res.send("running")
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})