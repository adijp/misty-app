import React from "react"

function Nav() {
    return (
        <nav style={{height : 100 }} className="navbar navbar-expand-lg navbar-light bg-light static-top header-a">
            <div className="container nav-container">
                <a style={{fontSize : 30}}className="navbar-brand brand" href="#">Misty</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse alink" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <a style={{fontSize : 10, height : 30, paddingTop : 6}} className="btn btn-outline-dark start" href="/login">Log In</a>
                        <a style={{fontSize : 10, height : 30, paddingTop : 6}} className="btn btn-outline-dark start" href="/signup">Sign Up</a>

                    </ul>


                </div>


            </div>
        </nav>
    );
}

export default Nav;