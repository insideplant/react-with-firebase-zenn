import React from "react";
import Signup from "./Signup";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import AuthFirebaseRoute from "./AuthFirebaseRoute";
import ForgotPassword from "./ForgotPassword";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route exact path="/" component={Home} />
            <Route path="/Login" component={Login} />
            <AuthFirebaseRoute path="/dashboard" component={Dashboard} />
          </Switch>
          {console.log(process.env)}
        </AuthProvider>
      </Router>
    )
    </>
  );
}
