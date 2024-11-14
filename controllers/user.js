const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { createUserDB, getUserbyEmailDB } = require("../helpers/user");

const registerUser = async (req, res) => {
    try {
        console.log("registerUser requested");
        const requestBody = req.body;

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";

        const { email, password, superAdmin } = requestBody;
        if (!email || !email.length || !password || !password.length) throw "Missing required data";

        let userRole = superAdmin ? 3 : 1;
        console.log(userRole);
        

        const salt = await bcrypt.genSalt(); // Create a random SALT (Encryption)
        const passwordHash = await bcrypt.hash(password, salt);
        requestBody.password = passwordHash;
        requestBody.userRole = userRole;

        const isExistingUser = await getUserbyEmailDB(email);
        if (isExistingUser) throw "User already exists";

        const savedUser = await createUserDB(requestBody);
        savedUser.password = undefined;
        savedUser.id = undefined;

        res.status(201).json({
            message: "created user successfully",
            data: savedUser
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("registerUser Error", error);
        res.status(500).json({
            message: error || "failed to create user",
            data: {}
        });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log("loginUser requested");
        const requestBody = req.body;

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";

        const { email, password } = requestBody;

        if (!email || !email.length || !password || !password.length) throw "Missing required data";

        const user = await getUserbyEmailDB(email);
        if (!user) throw "User not found";

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw "Incorrect password";

        // Here you can generate a JWT token or manage the session as per your application requirements
        const jwt_secret = process.env.JWT_SECRET;
        const token = jwt.sign({
            email: user.email,
            userId: user.id
        }, jwt_secret, {
            expiresIn: '24h'
        });

        user.password = undefined;
        console.log(user);
        

        res.status(200).json({
            message: "Login successful",
            data: token,
            user_role: user.role_id,
            user: user
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("loginUser Error", error);
        res.status(401).json({
            message: error || "Login failed",
            data: {}
        });
    }
};


module.exports = {
    registerUser,
    loginUser
}