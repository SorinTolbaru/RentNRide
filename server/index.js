const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const Accounts = require("./schemas/Accounts");
const Cars = require("./schemas/Cars");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURL = "mongodb+srv://tolbarusorin:qwerty123@chatx.orqrk1y.mongodb.net/RentNRide";

mongoose.connect(mongoURL);

const dbConnection = mongoose.connection;

dbConnection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

dbConnection.once("open", () => {

    console.log("Connected to MongoDB");

    const server = app.listen('3000',()=>{
        console.log('server started on http://localhost:3000');
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
        let rawData = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${drop}&origins=${pick}&units=metric&key=AIzaSyBgG2ZFnmUnevD6YNPtwczEiJXf_8Uqtmw`);
        let data = await rawData.json()
        res.send(data)
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
           await Accounts.findOneAndUpdate(
                { _id:req.params.id },
                { $set: req.body },
                { new: true, runValidators: true }
            )
            if(req.params.carname){
            await Cars.findOneAndUpdate(
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

})