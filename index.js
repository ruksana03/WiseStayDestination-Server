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
const userRoomReviewCollection = database.collection('RoomReview');

// ::::::::: add room ::::::::::::
// post 
app.post("/rooms", async (req, res) => {
    try {
        const body = req.body;
        const result = await roomCollection.insertOne(body);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})


// Get all
app.get('/rooms', async (req, res) => {
    try {
        const result = await roomCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// get one 
app.get("/rooms/:id", async (req, res) => {
    try {
        const rooms = await roomCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log(rooms);
        res.send(rooms);
    } catch (error) {
        console.log(error);
    }
})

// Delete 
app.delete("/rooms/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await roomCollection.deleteOne(query);
        res.send(result);
        console.log(result)
    } catch (err) {
        console.log(err);
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
        console.log(body);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// :::::::::::::: Subscription :::::::::::::
// post 
app.post("/subscription", async (req, res) => {
    try {
        const body = req.body;
        const result = await subscriptionCollection.insertOne(body);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        // res.send(err);
    }
})

//  Get all subscription 
app.get('/subscription', async (req, res) => {
    try {
        const result = await subscriptionCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// get one 
app.get("/subscription/:id", async (req, res) => {
    try {
        const subscribe = await subscriptionCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log(subscribe);
        res.send(subscribe);
    } catch (error) {
        console.log(error);
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
        console.log(err);
        // res.send(err);
    }
})

//  Get all reviews
app.get('/reviews', async (req, res) => {
    try {
        const result = await reviewCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// get one 
app.get("/reviews/:id", async (req, res) => {
    try {
        const review = await reviewCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log(review);
        res.send(review);
    } catch (error) {
        console.log(error);
    }
})

// booking Start 

app.post("/booking", async (req, res) => {
    try {

        const body = req.body;
        const result = await bookingCollection.insertOne(body);
        console.log(result);
        res.send(result);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        // res.send(err);
    }
})

app.get('/checkAvailability', async (req, res) => {
    try {
        const { roomNum, checkInDate, checkOutDate } = req.query;

        // Check if there are any bookings for the given room and date range
        const existingBooking = await bookingCollection.findOne({
            roomNum,
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
                { checkInDate: { $gte: checkInDate, $lte: checkOutDate } },
            ],
        });
        // Respond with availability status
        res.send({ available: !existingBooking });
    } catch (error) {
        console.log(error);
        // res.send(err);
    }
});


// // get

app.get('/bookings', async (req, res) => {
    try {
        const result = await bookingCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

app.get("/bookings/:id", async (req, res) => {
    try {
        const bookingRoom = await bookingCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log(bookingRoom);
        res.send(bookingRoom);
    } catch (error) {
        console.log(error);
    }
})

// update : Put ::::::::::::::::::
app.put("/bookings/:id", async (req, res) => {
    try {
        const id = { _id: new ObjectId(req.params.id) };
        const body = req.body;
        const updatedData = {
            $set: {
                ...body,
            },
        };
        const option = { upsert: true };
        const result = await bookingCollection.updateOne(id, updatedData, option);
        console.log(body);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// delete 
app.delete("/bookings/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await bookingCollection.deleteOne(query);
        res.send(result);
        console.log(result)
    } catch (err) {
        console.log(err);
    }
})


// userReview Room 

app.post("/userReviewsForRoom", async (req, res) => {
    try {
        const body = req.body;

        // Check if the user has already reviewed this room
        const existingReview = await userRoomReviewCollection.findOne({
            username: body.username,
            roomNum: body.roomNum,
        });

        if (existingReview) {
            // User has already reviewed this room, send an error response
            return res.status(400).json({ error: "User has already reviewed this room." });
        }

        // User hasn't reviewed this room yet, proceed with insertion
        const result = await userRoomReviewCollection.insertOne(body);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get('/userReviewsForRoom', async (req, res) => {
    try {
        const result = await userRoomReviewCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

app.get("/userReviewsForRoom/:id", async (req, res) => {
    try {
        const bookingRoom = await userRoomReviewCollection.findOne({ _id: new ObjectId(req.params.id) });
        console.log(bookingRoom);
        res.send(bookingRoom);
    } catch (error) {
        console.log(error);
    }
})


app.get('/', (req, res) => {
    res.send("running")
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})