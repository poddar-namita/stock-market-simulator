require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "stock_market_simulator",
});

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlCheck = "SELECT * FROM user WHERE username = ? OR email_id = ?;";
    db.query(sqlCheck, [username, email], (err, result) => {
        //console.log(result.length);
        if (err) {
            res.send(err);
        }
        if (result.length > 0) {
            if (result[0].username == username) {
                res.send({ message: "Username already exists" });
            } else if (result[0].email_id == email) {
                res.send({ message: "Email ID already exists" });
            }
            //console.log(result);
        } else {
            const sqlInsert =
                "INSERT INTO user (username,email_id,password) VALUES (?,?,?);";
            db.query(
                sqlInsert,
                [username, email, hashedPassword],
                (err, result) => {
                    //console.log(result.affectedRows);
                    //console.log(username);
                    if (err) {
                        console.log(err);
                    }
                    if (result.affectedRows > 0) {
                        res.send({ success: "Registration Successfull" });
                    } else {
                        res.send({ fail: "Registration Failed" });
                    }
                }
            );
        }
    });
});

app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlSelect = "SELECT user_id,password FROM user WHERE email_id = ?;";
    db.query(sqlSelect, [email], async (err, result) => {
        console.log(result);
        if (err) {
            res.send(err);
        }
        if (result.length > 0) {
            try {
                if (await bcrypt.compare(password, result[0].password)) {
                    //console.log(hashedPassword);
                    //console.log(hashedPassword2);
                    console.log("Success");
                    const user = { email: email, password: password };
                    const accessToken = jwt.sign(
                        user,
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    console.log(accessToken);
                    res.send({ accessToken: accessToken });
                } else {
                    res.send({ message: "Invalid password!" });
                    console.log("fail");
                }
            } catch {}
        } else {
            res.send({ message: "Email ID doesn't exists!" });
        }
        //res.send(result);
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});
