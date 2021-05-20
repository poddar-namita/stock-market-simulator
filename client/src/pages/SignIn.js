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
    fail: {
        backgroundColor: "#f8d7da",
        //fontWeight: "bold",
        color: "#721c24",
        padding: "10px",
        display: "none",
    },
});

const SignIn = () => {
    const [emailLog, setEmailLog] = useState("");
    const [passwordLog, setPasswordLog] = useState("");
    const [failed, setFailed] = useState("");

    const validate = () => {
        //console.log(validEmail.test(emailLog));
        if (emailLog === "" || passwordLog === "") {
            return "empty";
        } else if (!validEmail.test(emailLog)) {
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

    const loginUser = () => {
        if (validate() === "empty") {
            setFailed("All Fields are required");
            displayFail();
        } else if (validate() === "invalid email") {
            setFailed("Invalid Email Id");
            displayFail();
        } else {
            Axios.post("http://localhost:3001/api/login", {
                email: emailLog,
                password: passwordLog,
            }).then((response) => {
                if (response.data.message) {
                    setFailed(response.data.message);
                    displayFail();
                    console.log(response.data.message);
                } else {
                    //setFailed(response.data.accessToken);
                    //displayFail();
                    console.log(response);
                }
            });
        }
    };

    const classes = useStyle();
    return (
        <React.Fragment>
            <Typography
                id="failed"
                variant="h6"
                align="center"
                className={classes.fail}
            >
                {failed}
            </Typography>
            <CssBaseline />
            <div className={classes.root}>
                <Container>
                    <ThemeProvider theme={theme}>
                        <Typography variant="h4" className={classes.title}>
                            Sign In
                        </Typography>

                        <form
                            className={classes.form}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                id="email"
                                label="Email Id"
                                variant="outlined"
                                color="primary"
                                className={classes.textBox}
                                onChange={(e) => {
                                    setEmailLog(e.target.value);
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
                                    setPasswordLog(e.target.value);
                                }}
                            />
                            <Button
                                className={classes.signup}
                                variant="contained"
                                size="large"
                                onClick={loginUser}
                            >
                                Sign in
                            </Button>
                            <Link to="/signup" className={classes.link}>
                                <Typography className={classes.signin}>
                                    Don’t have an account? Sign up
                                </Typography>
                            </Link>
                        </form>
                    </ThemeProvider>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SignIn;
