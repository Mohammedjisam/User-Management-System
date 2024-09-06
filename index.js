const nocache = require("nocache");
const express = require("express");
const app = express();
app.use(nocache());
const mongoose = require("mongoose");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(expressLayout);

app.set("layout", "layouts/layout");

//for user
const userRoute = require("./routes/userRoute");
``;
app.use("/", userRoute);

//for Admin
const adminRoute = require("./routes/adminRoute");
``;
app.use("/admin", adminRoute);

app.listen(3000, () => {
    console.log("surver running at: http://localhost:3000");
});
