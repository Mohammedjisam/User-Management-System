const express = require("express");
const admin_route = express();

const config = require("../config/config");
const session = require("express-session");
admin_route.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
    })
);

const bodyParse = require("body-parser");
const adminController = require("../controllers/adminController");

admin_route.use(bodyParse.json());
admin_route.use(bodyParse.urlencoded({ extended: true }));

admin_route.set("view engine", "ejs");

admin_route.set("views", "./views/admin");

const auth = require("../middleware/adminAuth");

admin_route.get("/", auth.isLogout, adminController.loadLogin);

admin_route.post("/", adminController.verifyLogin);

admin_route.get("/home", auth.isLogin, adminController.loadDashboard);

admin_route.get("/logout", auth.isLogin, adminController.logout);

admin_route.get("/dashboard", auth.isLogin, adminController.adminDashboard);
//search implementation
admin_route.post("/dashboard", auth.isLogin, adminController.searchUser);

admin_route.get("/new-user", auth.isLogin, adminController.newUserLoad);
admin_route.post("/new-user", adminController.addUser);

admin_route.get("/edit-user", auth.isLogin, adminController.editUserLoad);
admin_route.post("/edit-user", adminController.updateUser); 

admin_route.get("/delete-user", adminController.deleteUser);

admin_route.get("*", (req, res) => {
    res.redirect("/admin");
});

module.exports = admin_route;
