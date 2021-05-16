import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
    return (
        <>
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/signup" exact component={SignUp} />
                    <Route path="/signin" exact component={SignIn} />
                </Switch>
            </Router>
        </>
    );
};

export default App;
