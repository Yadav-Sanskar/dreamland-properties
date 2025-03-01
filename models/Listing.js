const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) => {
      // Log the value being passed to the setter
      
      
      // If it's an object with a `url` property, return the URL as a string
      if (v && typeof v === 'object' && v.url) {
        return v.url; // Extract only the `url` property
      }
      
      // If it's already a string or anything else, just return the value as it is
      return v || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
