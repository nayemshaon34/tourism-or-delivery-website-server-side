const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

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
    }

    finally{
        await client.close();
    }
}

run().catch(console.dir());

app.listen(port,()=>{
    console.log("Listening from port: ",port);
})