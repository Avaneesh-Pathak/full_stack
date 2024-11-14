const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require('multer');
const upload = multer();
const { verifyToken, verifyKey, verifyTenant } = require("./middleware/auth");

/* APP CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(upload.none());
app.use(express.json());
app.use(cors());

/* SERVER CONFIGURATIONS */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log("Server Running on PORT", PORT));

/* ROUTES */
app.get("/", (req, res) => { res.json({ status: "healthy" }) });
app.get("/health", (req, res) => { res.json({ status: "healthy" }) });
app.use('/user', require('./routes/user'));
app.use("/api", verifyToken, require('./routes'));

/* This is a custom route for all the invalid routes */
app.use('*', function (req, res) {
    return res.status(400).json({ message: 'invalid route', data: {} });
});

module.exports = app;