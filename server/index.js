const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const Accounts = require("./schemas/Accounts");
const Cars = require("./schemas/Cars");

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config()

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


const mongoURLKey = process.env.MONGO_DATABASE_URL;
const apiKey = process.env.API_KEY;
const mongoURL = mongoURLKey;

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnection = mongoose.connection;
dbConnection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

dbConnection.once("open", () => {

    console.log("Connected to MongoDB");

    const server = app.listen('3000',()=>{
        console.log('server started with no problems');
    })

    app.use(express.static('public'))
    app.use('/', express.static(path.join(__dirname,'..','public')))

    app.get("/carsData",async (req,res)=>{
        let allCars = await Cars.find({})
        res.send(allCars)
    })

    app.get("/usersData",async (req,res)=>{
        let allAccounts = await Accounts.find({})
        res.send(allAccounts)
    })

    app.get("/getDistance",async (req,res)=>{
        const {drop, pick} = req.query
        let coordonateDrop = await getCoordonates(drop)
        let coordonatePick = await getCoordonates(pick)

        let dropLocation = {lat:coordonateDrop[0].latitude,lon:coordonateDrop[0].longitude}
        let pickLocation = {lat:coordonatePick[0].latitude,lon:coordonatePick[0].longitude}

        res.send([dropLocation, pickLocation])
    })

    app.get("/checkRide/:id",async (req,res)=>{
        let id = req.params.id
        let account = await Accounts.findOne({_id:id})
        res.send(account)
    })

    app.post("/newUser",async (req,res)=>{
        let data = req.body;
        const newAccount = new Accounts({
            email:data.email,
            user: data.user,
            pass:data.pass,
            status:data.status,
            times_rented: data.times_rented,
            current_rent: data.current_rent,
            review: data.review
    })
        newAccount.save();
        res.send(newAccount._id)
    })
    
    app.put("/modifyRide/:id/:carname",async(req,res)=>{
        console.log(req.params.id,req.params.carname);
        try{
           await Accounts.updateOne(
                { _id:req.params.id },
                { $set: req.body },
                { new: true, runValidators: true }
            )
            if(req.params.carname){
            await Cars.updateOne(
                { carname:req.params.carname },
                { $inc: { wanted: 1 } },
                { new: true, runValidators: true }
            )
            }
            res.send(true)
        } catch (error) {
            console.error('Error updating user:', error.message);
        }
  
    })

    async function getCoordonates(city) {
        return await fetch('https://api.api-ninjas.com/v1/geocoding?city=' + city,
        {
            headers: {
                'X-Api-Key': apiKey
              }
        }).then((rawCoordonate)=>rawCoordonate.json()).then((data)=>{return data});
    }

})