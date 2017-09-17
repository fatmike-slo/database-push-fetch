const mongoose = require("mongoose"), Admin = mongoose.mongo.Admin;

mongoose.connect("mongodb://fatmike:A10Warthog@ds161471.mlab.com:61471/fatmongodb", {
    useMongoClient:true
});

// create a new schema and instaciate it
let Schema = mongoose.Schema;
let friendsSchema = new Schema({
    name:String,
    nickname:String,
    age:Number,
    date_when_added:String
});

// a quick check if connected or not
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log('connected');
    
});

let Friends = mongoose.model("friends", friendsSchema);

module.exports = Friends;