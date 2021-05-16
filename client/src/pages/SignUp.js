import {
    Container,
    createMuiTheme,
    CssBaseline,
    makeStyles,
    TextField,
    ThemeProvider,
    Typography,
    Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { validEmail } from "../components/regex";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#0353A4",
        },
    },
});

const useStyle = makeStyles({
    root: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        textAlign: "center",
        color: "#0353A4",
        fontWeight: "bold",
    },
    textBox: {
        width: "60vh",
        margin: "20px 0px 0px 0px",
    },
    link: {
        textDecoration: "none",
    },
    signup: {
        display: "block",
        width: "60vh",
        backgroundColor: "#0353A4",
        color: "white",
        fontWeight: "bold",
        padding: "10px 25px",
        borderRadius: "5px",
        fontSize: "20px",
        margin: "20px 0px 0px 0px",
        "&:hover": {
            backgroundColor: "#034d96",
        },
    },
    signin: {
        margin: "20px 0px 0px 0px",
        color: "#0466C8",
    },
    success: {
        backgroundColor: "#d4edda",
        //fontWeight: "bold",
        color: "#155724",
        padding: "10px",
        display: "none",
    },
    fail: {
        backgroundColor: "#f8d7da",
        //fontWeight: "bold",
        color: "#721c24",
        padding: "10px",
        display: "none",
    },
});

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState("");
    const [fail, setFail] = useState("");

    const validate = () => {
        if (username === "" || email === "" || password === "") {
            return "empty";
        } else if (!validEmail.test(email)) {
            return "invalid email";
        }
    };

    const displayFail = () => {
        setTimeout(() => {
            document.getElementById("failed").style.display = "block";
        }, 0);
        setTimeout(() => {
            document.getElementById("failed").style.display = "none";
        }, 2000);
    };

    const displaySuccess = () => {
        setTimeout(() => {
            document.getElementById("successfull").style.display = "block";
        }, 0);
        setTimeout(() => {
            document.getElementById("successfull").style.display = "none";
        }, 2000);
    };

    const submitUser = () => {
        if (validate() === "empty") {
            setFail("All Fields are required");
            displayFail();
        } else if (validate() === "invalid email") {
            setFail("Invalid Email Id");
            displayFail();
        } else {
            Axios.post("http://localhost:3001/api/register", {
                username: username,
                email: email,
                password: password,
            }).then((response) => {
                if (response.data.success) {
                    setSuccess(response.data.success);
                    displaySuccess();
                    document.getElementById("username").value = "";
                    document.getElementById("email").value = "";
                    document.getElementById("password").value = "";
                    document.getElementById("username").focus();
                } else if (response.data.fail) {
                    setFail(response.data.fail);
                    displayFail();
                } else {
                    setFail(response.data.message);
                    displayFail();
                }
                //console.log(response.data);
            });
        }
    };

    const classes = useStyle();
    return (
        <React.Fragment>
            <Typography
                id="successfull"
                variant="h6"
                align="center"
                className={classes.success}
            >
                {success}
            </Typography>
            <Typography
                id="failed"
                variant="h6"
                align="center"
                className={classes.fail}
            >
                {fail}
            </Typography>
            <CssBaseline />
            <div className={classes.root}>
                <Container>
                    <ThemeProvider theme={theme}>
                        <Typography variant="h4" className={classes.title}>
                            Sign Up Now!
                        </Typography>

                        <form
                            className={classes.form}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                color="primary"
                                className={classes.textBox}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />
                            <TextField
                                id="email"
                                label="Email Id"
                                variant="outlined"
                                color="primary"
                                className={classes.textBox}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                color="primary"
                                type="password"
                                className={classes.textBox}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <Button
                                className={classes.signup}
                                variant="contained"
                                size="large"
                                onClick={submitUser}
                            >
                                Sign up
                            </Button>
                            <Link to="/signin" className={classes.link}>
                                <Typography className={classes.signin}>
                                    Already have an account? Sign in
                                </Typography>
                            </Link>
                        </form>
                    </ThemeProvider>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SignUp;
