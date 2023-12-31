const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main().then(()=>{
    console.log("connectrd to DB");
  })
  .catch(err => console.log(err))
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({
      ...obj,owner:"658cdcae15859a34cafc3f8d"
    }))
    await Listing.insertMany(initData.data)
    console.log("data is inserted");
}

initDB()