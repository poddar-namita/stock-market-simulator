const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "stock_market_simulator",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const sqlCheck = "SELECT * FROM user WHERE username = ? OR email_id = ?;";
    db.query(sqlCheck, [username, email], (err, result) => {
        //console.log(result.length);
        if (err) {
            res.send(err);
        }
        if (result.length > 0) {
            res.send({
                message: "Username or Email already exists",
            });
        } else {
            const sqlInsert =
                "INSERT INTO user (username,email_id,password) VALUES (?,?,?);";
            db.query(sqlInsert, [username, email, password], (err, result) => {
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
            });
        }
    });
});

app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlSelect = "SELECT * FROM user WHERE email_id = ? AND password=?;";
    db.query(sqlSelect, [email, password], (err, result) => {
        console.log(result);
        res.send(result);
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});
