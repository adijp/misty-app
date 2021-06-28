import React, { Component } from "react"
// import logo from '../../components/Logo/logo.svg';

import Content from './Content';
import Copyright from "../../Copyright";
import Nav from "../../Nav/Nav";
class Index extends Component {
    render() {
        return (
            <div class="main-container">
                <Nav/>
                <Content />
                <br></br>
                <br></br>
                <Copyright/>
            </div>

        )
    }
}

export default Index;