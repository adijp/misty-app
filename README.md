#

misty-app

This repository contains all the code for Misty, a personal finance app which helps users budget smarter. Here is a link to Misty - [misty-prod.herokuapp.com/](https://misty-prod.herokuapp.com/).

Misty uses [Plaid](https://www.plaid.com) to securely connect to bank accounts in US and Canada. Misty relies on [Google Firebase](https://firebase.google.com/) for the backend. In particular, Misty uses Firebase Authentication for handling user auth and Firestore as a document database.

This app was built using the [Plaid Quickstart](https://github.com/plaid/quickstarthttps://www.plaid.com) module on Github as a starting point. The landing page for Misty was built using [000kelvin/react-landing-page](https://github.com/000kelvin/react-landing-page).

To run Misty locally,

## 1. Clone the repository

Using https:

```
$ git clone https://github.com/adijp/misty-app.git
$ cd misty-app
```

## 2. Setting up keys and variables.

Misty requires API keys from both [Plaid](https://www.plaid.com) and [Google Firebase](https://firebase.google.com/).

### Plaid API keys setup

- Open `node/index.js`.
- Replace `PLAID_CLIENT_ID` and `PLAID_SECRET` with your own keys. If you are running it in
 development, set `PLAID_ENV = "development"`. You can either enter the keys directly into `index.js` or use environment variables.

### Firebase API keys setup
- Open `frontend/firebase.js`.
- Update the `config` variable with Firebase credentials.
