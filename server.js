const express = require("express");
const path = require("node:path");
const app = express();
app.use(express.static(path.join(__dirname, "web")));
app.use(express.json({ limit: "5mb"}));
const items = [];
app.get("/api/items", (req, res) =>{
    res.json(items);
});
app.post("/api/items", (req, res)=>{
    const {type, description, date, location, holdingLocation, photo } =
        req.body || {};
    const requiredFields = [type, description, date, location, holdingLocation];
    for (const field of requiredFields){
        if (typeof field != "string" || field.trim() == ""){
            return res.status(400).json({error: "Fill in all required fields."});
        }
    }
    const item = {
        id: items.length + 1,
        type,
        description,
        date,
        location,
        holdingLocation,
        photo: photo || ""
    };
    items.push(item);
    res.status(201).json(item);
});

app.listen(3000, () => {
    console.log("GMUFind is running in http://localhost:3000");

});