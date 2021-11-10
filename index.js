const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkuqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try {
        await client.connect();
        const database = client.db('tourism');
        const eventCollection = database.collection('events');
        const joinCollection = database.collection('join');

        // create api data
        app.post('/event', async (req, res) => {
            const newEvent = req.body;
            const result = await eventCollection.insertOne(newEvent);
            res.json(result);
        });

        // read api data
        app.get('/event', async (req, res) => {
            const cursor = eventCollection.find({});
            const allEvent = await cursor.toArray();
            res.send(allEvent);
        });

        // delete api data
        app.delete('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await eventCollection.deleteOne(query);
            res.json(result);
        });

        // read single api data
        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await eventCollection.findOne(query);
            res.send(result);
        });

        // update api
        app.put('/event/:id', async (req, res) => {
            const id = req.params.id;
            const updatedEvent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updatedEvent.title,
                    img: updatedEvent.img,
					address: updatedEvent.address,
					description: updatedEvent.description
                },
            };
            const result = await eventCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });

        // create api data for join
        app.post('/join', async (req, res) => {
            const newEvent = req.body;
            const result = await joinCollection.insertOne(newEvent);
            res.json(result);
        });

        // read api data for join
        app.get('/join', async (req, res) => {
            const cursor = joinCollection.find({});
            const allEvent = await cursor.toArray();
            res.send(allEvent);
        });

        // delete api data
        app.delete('/join/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await joinCollection.deleteOne(query);
            res.json(result);
        });
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(port, () => {
    console.log('Server is Running on Port:', port);
});