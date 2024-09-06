const { Admin } = require("mongodb");
const userModal = require("../models/userModal");
const User = require("../models/userModal");
const bcrypt = require("bcrypt");

//secure password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};

const loadLogin = async (req, res) => {
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

        const userData = await userModal.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    return res.render("login", { message: "invalid credetntials" });
                } else {
                    req.session.user_id = userData._id;
                    return res.redirect("/admin/home");
                }
            } else {
                return res.render("login", { message: "invalid credetntials" });
            }
        } else {
            return res.render("login", { message: "invalid credetntials" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const loadDashboard = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });

       if(userData.is_admin === 1){
        return res.render("home", { Admin: userData });
       }else{
        res.redirect("/");
       }
    } catch (error) {
        console.log(error.message);
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
};
const adminDashboard = async (req, res) => {
    try {
        const usersData = await User.find({ is_admin: 0 });

        return res.render("dashboard", { users: usersData });
    } catch (error) {
        console.log(error.message);
    }
};

const searchUser = async (req, res) => {
    try {
        const searchData = req.body.searchItem || "";
        const regex = new RegExp(`^${searchData}`, `i`);

        const usersData = await User.find({
            is_admin: 0,
            $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
        });
        return res.render("dashboard", { users: usersData });

        console.log(searchData);
    } catch (error) {
        console.log(error.message);
    }
};

//add new user
const newUserLoad = async (req, res) => {
    try {
        return res.render("new-user");
    } catch (error) {
        console.log(error.message);
    }
};
const addUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        console.log(req.body);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: 0,
        });

        const userData = await newUser.save();

        if (userData) {
            return res.render("new-user", { message: "New user added " });
        } else {
            return res.render("new-user", { message: "Failed to add user" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

//edit user
const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            return res.render("edit-user", { user: userData });
        } else {
            return res.redirect("/admin/dashboard");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate(
            { _id: req.body.id },
            { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } }
        );
        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id: id });
        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser,
    searchUser,
};
