require('dotenv').config();
const express = require("express");
const app = express();

const __exposedDir = __dirname + "/public/";

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: API_KEY
});

var base = Airtable.base(API_URL);

const startup = async () => {
    let tempRecordJson = [];

    const getRecords = async () => {
        try{
            const records = await base('Business Hours').select({
                view: "Grid view",
            }).firstPage();
            for(let record of records){
                console.log(record.get("Day"), record.get("Hours"));
                tempRecordJson.push({
                    day: record.get("Day"),
                    hour: record.get("Hours")
                 })
            }
            setTimeout(()=>{
                console.log("timeout! cleaning cache")
                tempRecordJson = [];
            },60000);
            return tempRecordJson;
        }catch(ex){
            console.log("something happened while retriving database information",'\n', ex);
        }
    }

    app.use(express.static(__dirname + "/public"));

    app.get("/", (req, res)=> {
        res.sendfile(__exposedDir + "index.html");
    });

    app.get("/get_business_hours", async (req,res)=>{
        console.log("getting business hours");
        if(tempRecordJson && tempRecordJson.length > 0){
            console.log("returning cached hours: ", tempRecordJson);
        } else {
            console.log ("doing a new query to DB")
        }
        tempRecordJson = await getRecords();
        res.json(tempRecordJson);
    })

    app.listen(3000, ()=> console.log("server running"));

}

startup();