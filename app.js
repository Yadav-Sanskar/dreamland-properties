const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 
const wrapAsync = require("./utils/wrapAsyc.js") 
const ExpressError = require("./utils/ExpressError.js")

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
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Code to link page
 
// index.route
app.get("/listings", wrapAsync( async (req, res) => { 
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
})
);


app.get("/listings/new",wrapAsync( (req, res) => {  
    res.render("listings/new.ejs"); 
})
);
// Create new enter
app.post("/listings", wrapAsync(async (req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
})
); 

//Edit Router 
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
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
})
); 

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect(`/listings/${id}`);

})
);

//DELETE Roue                                                        
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    try {
        let { id } = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id); 

        if (!deleteListing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        res.json({ message: "Listing deleted successfully",  });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
);




// Show route
app.get("/listings/:id",wrapAsync( async (req, res) => {
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
    
})
);

// To find error 
app.use((err, req, res, next)=>{
    let{ statusCode =500, message="Something Went Wrong!"}=err;
    res.status(statusCode).send(message);
})

app.get("/",(req,res)=>{
    res.send("Hell World") 
});

app.all("*",(req,res)=>{
    res.send("Page Not Found!") 
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`));   
