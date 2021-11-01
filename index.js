const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const { application } = require('express');


const port = process.env.PORT || 4000;


// middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello from server")
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odfms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

   
async function run(){
    try{
        await client.connect();
        console.log("Connecting to Database");

        const database = client.db("tour-service");
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection('orders');

        // get api
        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({}); //for getting all data
            const result = await cursor.toArray();
            res.json(result);
        })

        // get single service
        app.get('/services/:id',async (req,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.json(result);
        })
       
        // post api
        app.post('/services',async(req,res) =>{
            const doc = req.body;
            const result = await serviceCollection.insertOne(doc);
            console.log("hitted", result);
            res.json(result);
        })
        // order api
        app.post('/addOrder',async(req,res)=>{
            const doc = req.body;
            const result = await orderCollection.insertOne(doc);
            console.log("order hitted");
            res.json(result);
        })
        // get manage api
        app.get('/manageOrder',async(req,res)=>{
            const cursor = orderCollection.find({}); //for getting all data
            const result = await cursor.toArray();
            res.json(result);
        })

         //order delete api
         app.delete('/myOrder/:id',async (req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {id:ObjectId(id)
            };
            const result = await orderCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

        // order get
        app.get('/myOrder/:email', async(req,res)=>{
            console.log(req.params.email);
            const email = req.params.email;
            
            const result = await orderCollection.find({email}).toArray();
            console.log(result);
            res.json(result);
        })
    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir());

app.listen(port,()=>{
    console.log("Listening from port: ",port);
})