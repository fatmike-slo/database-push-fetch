const express = require("express");
const app = express();

// all the good juice
const cors = require("cors");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars")
const path = require("path");

//database
const Friends = require("./db.js")

//set the view engine
app.engine("hbs", handlebars({ extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/views/layouts" }));
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(__dirname + "/public"));

// date generator
let now = new Date();
let formatDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
}


// SPLASH
app.get("/", (req, res) => {
    res.sendfile("public/index");
});

// ADD
app.post("/add", (req, res) => {
    new Friends({
        name: req.body.name,
        nickname: req.body.nickname,
        age: req.body.age,
        // add timestamp
        date_when_added: now.toLocaleDateString("en-US", formatDate)
    }).save((err, data) => {
        if (err) {
            console.log(err);
        }
        console.log("data added");
        res.redirect("/view");
    });
});

// UPDATE
app.post("/update", (req, res) => {
    Friends.findOneAndUpdate({
        name: req.body.name
    },
        {
            nickname: req.body.nickname,
            age:req.body.age
        }, (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log("data updated");
            res.redirect("/view")
        });
});

// DELETE
app.post("/delete", (req,res)=> {
    Friends.findOneAndRemove({
        name:req.body.name
    }, (err)=> {
        if(err) {
            console.log(err);
        }
        console.log('data deleted');
        res.redirect("/view");
        
    });
});


// VIEW
app.get("/view", (req, res) => {
    Friends.find({}, (err, data) => {
        let arrName = [];
        let arrNn = [];
        let arrAge = [];
        let arrDate = [];
        data.forEach((item) => {
            arrName.push(item.name);
            arrNn.push(item.nickname);
            arrAge.push(item.age);
            arrDate.push(item.date_when_added);
        });
        res.render("index", {
            arrName: arrName,
            arrNn: arrNn,
            arrAge: arrAge,
            arrDate: arrDate,
            allData: data
        });
    });
});

let listener = app.listen(process.env.PORT || 3000, ()=> {
    console.log('Connected on port ' + listener.address());
});