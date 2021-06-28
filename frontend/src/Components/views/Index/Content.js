import React from "react";

function Content() {
    return (
        <div>
            <div className="container content">
                <div className="row">
                    <div className="col-sm-9 talk">
                        <h1>De-mistify </h1>
                        <h1>Your Budget</h1>
                        <br />
                        <h3 className="bold-four">
                        Misty connects to your bank securely using <a href="https://plaid.com/">Plaid</a> and helps you get insight into your spending. 
                        </h3>
                        <br />
                        <h6><a className="btn btn-dark start start-two" href="/signup">Get Started</a></h6>
                        <br></br>
                        <h3>
                       Want to try Misty using a demo account? <a href="/login">Login</a> using demo.misty.app@gmail.com and 123456 as credentials.
                    </h3>
                    </div>
                </div>
            </div>

            <section class="features-icons bg-light text-center det-ails">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class="icon-screen-desktop m-auto text-primary icon-ails"></i>
                                </div>
                                <h5>Import all your accounts</h5>
                                <p class="lead mb-0">Misty helps you get all your financial information in one place to get a big picture view of your personal finances.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class="icon-layers m-auto text-primary icon-ails"></i>
                                </div>
                                <h5>Categorize Transactions</h5>
                                <p class="lead mb-0">Misty allows you to create categories and designate a transaction to a category.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class="icon-check m-auto text-primary icon-ails"></i>
                                </div>
                                <h5>Budgets</h5>
                                <p class="lead mb-0">Misty lets you set budgets and track your progress.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Content;