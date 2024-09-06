const user = require("../models/userModal");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};

const loadRegister = async (req, res) => {
    try {
        return res.render("registration", { message: "" });
    } catch (error) {
        console.log(error.message);
    }
};

const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);

        const existingUser = await user.findOne({ email: req.body.email });
        const existingNumber = await user.findOne({ mobile: req.body.mobile });

        if (existingUser) {
            // If email already exists
            return res.render("registration", { message: "Email already exists" });
        } else if (existingNumber) {
            return res.render("registration", { message: "Mobile Number already exists" });
        } else {
            const newUser = new user({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: spassword,
                is_admin: 0,
            });

            const userData = await newUser.save();

            if (userData) {
                return res.render("registration", { message: "You are registered now." });
            } else {
                return res.render("registration", { message: "Your registration failed." });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

//login user method

const loginLoad = async (req, res) => {
    try {
        return res.render("login");
    } catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await user.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                req.session.user_id = userData._id;
                return res.redirect("/home");
            } else {
                return res.render("login", { message: "login credential failed" });
            }
        } else {
            return res.render("login", { message: "login credential failed" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const loadHome = async (req, res) => {
    try {
        const UserData = await user.findById({ _id: req.session.user_id });
        return res.render("home", { User: UserData });
    } catch (error) {
        console.log(error.message);
    }
};

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
};

const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await user.findById({ _id: id });
        if (userData) {
            return res.render("edit-info", { user: userData });
        } else {
            return res.redirect("/home");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const userData = await user.findByIdAndUpdate(
            { _id: req.body.id },
            { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } }
        );
        return res.redirect("/home");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editUserLoad,
    updateUser,
};
