const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function seedDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        // Debug: Check initData
        console.log("🔍 Checking initData:", initData);

        if (!initData.data || initData.data.length === 0) {
            console.log("❌ Error: initData is empty!");
            return;
        }

        await Listing.deleteMany({});
        console.log("🗑️ Old Listings Deleted");

        const insertedListings = await Listing.insertMany(initData.data);
        console.log("✅ New Data Inserted:", insertedListings);

        mongoose.connection.close();
        console.log("🔌 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
}

seedDB();
