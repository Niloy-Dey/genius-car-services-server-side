const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');

//middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.clyrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('database is connected');
  // perform actions on the collection object
  client.close();
}); */
async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection = client.db('geniusCar').collection('order');

        // collect data for showing
        app.get('/service', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services) ;   
        })


        // single data finding for showing details
        app.get('/service/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // post data 
        app.post('/service',  async(req, res) =>{
            const newService = req.body;
            const result  = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //Delete api 
        app.delete('/service/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })


        //order collection api
        app.post('/order', async(req, res)=>{
            const order  = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })


        app.get('/order', async(req, res)=>{
            const email = req.query;
            console.log(email);
            const query ={email: email};
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send();
        })
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/hero' , (req, res) =>{
    res.send('hero meets heroku ');
})

app.get('/', (req, res) =>{
    res.send('Running genius server');
})

app.listen(port, () =>{
    console.log('listening to port 5000');
})