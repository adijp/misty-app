import Signup from "./Signup.js";
import React from "react";
import {Container} from "react-bootstrap"
import {AuthProvider} from "../contexts/AuthContext.js"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import 'bootstrap/dist/css/bootstrap.css';
export default function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight : "100vh"}}
    > 
    <Router>
    <AuthProvider>
      <Switch>
        <PrivateRoute exact path="/" component= {Dashboard} />
        <div className="w-100" style={{maxWidth:"800" }}>

        <Route path="/signup" component= {Signup} />
        <Route path="/login" component= {Login} />
        <PrivateRoute exact path="/update-profile" component= {UpdateProfile} />
        <Route path="/forgot-password" component= {ForgotPassword} />

        </div>
      </Switch>
    </AuthProvider>

    </Router>

    </Container>)
}
