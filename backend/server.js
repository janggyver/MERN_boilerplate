const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./memo");

const API_PORT = 3001;
const app = express();
const router = express.Router();

//path to deploy on AWS
const path = require("path");
app.use(express.static(path.join(__dirname, "client/build")));

//this is our MongoDB database
const dbRoute = process.env.MONGO_DB;

//connects our back end code with the database
mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
)

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

//checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

//(optional) only made for logging and
//bodyParser, pares the request body to ba a readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

//this is our get method
//this method fetches all available data in our database
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });
});

//this is our update method
//this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
    const {id, update } = req.body;
    console.log(id + "    앱에서 받아온 object 아이디 값")
    Data.findOneAndUpdate({_id: id}, update, {returnOriginal:false}, (err) => {
        if(err) return res.json({success: false, error: err});
        return  res.json({success: true});
    });
});

// router.post("/updateData", (req, res) => {
//     const {id, update } = req.body;
//     console.log(id + " id");
//     Data.findOneAndUpdate(id, update, err => {
//         if(err){
//             return res.json({success: false, error: err});
//         } 
//         return  res.json({success: true});
//     });
// });


//this is our delete method
//this method removes existing data in our database
// router.delete("/deleteData", (req, res) => {
//     const {id} = req.body;
//     Data.findOneAndDelete(id, err => {
//         if(err) return res.send(err);
//         return res.json({success: true});
//     });
// });
router.delete("/deleteData", (req, res, next) => {
    const {id} = req.body;
    Data.findOneAndRemove({_id: id}).then(
        (err) => {
            if(err) return res.send(err);
            return res.json({success: true});
        });
    });


//this is our create method
//this method adds new data in our database
router.post("/putData", (req, res) => {
    let data = new Data();
    const {id, message, password} = req.body;

    if((!id && id !==0) || (message == null)  || (password == null)){
        return res.json({
            success: false,
            error: "Invalid Inputs"
        })
    }
    data.message = message;
    data.id = id;
    data.password = password;
    data.save(err => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

//append /api for our http requests
app.use("/api", router);

//launch our backend into a port
app.listen(API_PORT, () => console.log(`Listening on PORT ${API_PORT}`));