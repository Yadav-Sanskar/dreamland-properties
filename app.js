const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to the database mongodb
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to db");
}
main().catch((err) => {
    console.log(err);
});

// attach the view page
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Code to link page

// index.route
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
});


app.get("/listings/new", (req, res) => {  
    res.render("listings/new.ejs"); 
});
// Create new enter
app.post("/listings", async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
})

//Edit Router 
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Remove any leading/trailing spaces

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");  
        }
        res.render("listings/edit", { listing }); // Render edit.ejs
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid ID format");
    } 
});

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect(`/listings/${id}`);

});

//DELETE Roue
app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing)
    res.redirect("/listings")
})


// Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Remove any leading/trailing spaces

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid ID format"); 
    }
    
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));   
