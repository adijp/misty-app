// read env vars from .env file
require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const APP_PORT = process.env.APP_PORT || 8000;


const PLAID_CLIENT_ID = "609b02c5107d160010ce5daf"//"609b02c5107d160010ce5daf";

const PLAID_SECRET = "b0138092a662e574acd2797be59fc3"; 
const PLAID_ENV = "sandbox";

// const PLAID_SECRET = "f94458a69461f2014efbefb3c2d951";
// const PLAID_ENV = "development"

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
  ',',
);

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
// The payment_id is only relevant for the UK Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store
let PAYMENT_ID = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());

app.post('/api/info', function (request, response, next) {
  response.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  });
});

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
app.post('/api/create_link_token', async function (request, response) {
  const configs = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user-id',
    },
    client_name: 'Plaid Quickstart',
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
  };

  if (PLAID_REDIRECT_URI !== '') {
    configs.redirect_uri = PLAID_REDIRECT_URI;
  }

  if (PLAID_ANDROID_PACKAGE_NAME !== '') {
    configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
  }
  try {
    const createTokenResponse = await client.linkTokenCreate(configs);
    prettyPrintResponse(createTokenResponse);
    response.json(createTokenResponse.data);
  } catch (error) {
    prettyPrintResponse(error.response);
    return response.json(formatError(error.response));
  }
});


// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#payment-initiation-create-link-token-request
app.post(
  '/api/create_link_token_for_payment',
  async function (request, response, next) {
    try {
      const createRecipientResponse = await client.paymentInitiationRecipientCreate(
        {
          name: 'Harry Potter',
          iban: 'GB33BUKB20201555555555',
          address: {
            street: ['4 Privet Drive'],
            city: 'Little Whinging',
            postal_code: '11111',
            country: 'GB',
          },
        },
      );
      const recipientId = createRecipientResponse.data.recipient_id;
      prettyPrintResponse(createRecipientResponse);

      const createPaymentResponse = await client.paymentInitiationPaymentCreate(
        {
          recipient_id: recipientId,
          reference: 'paymentRef',
          amount: {
            value: 12.34,
            currency: 'GBP',
          },
        },
      );
      prettyPrintResponse(createPaymentResponse);
      const paymentId = createPaymentResponse.data.payment_id;
      PAYMENT_ID = paymentId;
      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'user-id',
        },
        client_name: 'Plaid Quickstart',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
        payment_initiation: {
          payment_id: paymentId,
        },
      };
      if (PLAID_REDIRECT_URI !== '') {
        configs.redirect_uri = PLAID_REDIRECT_URI;
      }
      const createTokenResponse = await client.linkTokenCreate(configs);
      prettyPrintResponse(createTokenResponse);
      response.json(createTokenResponse.data);
    } catch (error) {
      prettyPrintResponse(error.response);
      return response.json(formatError(error.response));
    }
  },
);

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token', async function (request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  try {
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: PUBLIC_TOKEN,
    });
    prettyPrintResponse(tokenResponse);
    ACCESS_TOKEN = tokenResponse.data.access_token;
    ITEM_ID = tokenResponse.data.item_id;
    response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
    
  } catch (error) {
    prettyPrintResponse(error.response);
    return response.json(formatError(error.response));
  }
});

// Retrieve ACH or ETF Auth data for an Item's accounts
// https://plaid.com/docs/#auth
app.get('/api/auth', async function (request, response, next) {
  try {
    const authResponse = await client.authGet({ access_token: ACCESS_TOKEN });
    prettyPrintResponse(authResponse);
    response.json(authResponse.data);
  } catch (error) {
    prettyPrintResponse(error.response);
    return response.json(formatError(error.response));
  }
});
app.get('/api/get_trans'
, async function (request, response, next) {

    // console.log("works so far")
    const ret = client.getTransactions(accessToken, '2018-01-01', '2020-02-01', {})
  let transactions = ret.transactions;
  const total_transactions = ret.total_transactions;
  // console.log(total_transactions)
}
)

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.get('/api/transactions/:atoken', async function (request, response, next) {
  // Pull transactions for the Item for the last 30 days
  const startDate = moment().subtract(600, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  console.log("Token printing", request.params.atoken);
  const configs = {
    access_token: request.params.atoken,
    start_date: startDate,
    end_date: endDate,
    options: {
      count: 250,
      offset: 0,
    },
  };
  try {
    const transactionsResponse = await client.transactionsGet(configs);
    console.log(transactionsResponse.data["total_transactions"])
    // prettyPrintResponse(transactionsResponse["total_transactions"]);
    response.json(transactionsResponse.data);
  } catch (error) {
    prettyPrintResponse(error.response);
    return response.json(formatError(error.response));
  }
});




const server = app.listen(APP_PORT, function () {
  console.log('plaid-quickstart server listening on port ' + APP_PORT);
});

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

// This is a helper function to poll for the completion of an Asset Report and
// then send it in the response to the client. Alternatively, you can provide a
// webhook in the `options` object in your `/asset_report/create` request to be
// notified when the Asset Report is finished being generated.

const getAssetReportWithRetries = (
  plaidClient,
  asset_report_token,
  ms = 1000,
  retriesLeft = 20,
) =>
  new Promise((resolve, reject) => {
    const request = {
      asset_report_token,
    };

    plaidClient
      .assetReportGet(request)
      .then((response) => {
        return resolve(response);
      })
      .catch(() => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            return reject('Ran out of retries while polling for asset report');
          }
          getAssetReportWithRetries(
            plaidClient,
            asset_report_token,
            ms,
            retriesLeft - 1,
          ).then((response) => resolve(response));
        }, ms);
      });
  });

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};

const getTransactions = (req, res) => {
  // Pull transactions for the last 30 days
  let startDate = moment()
    .subtract(30, "days")
    .format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");
  console.log("made it past variables");
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    function(error, transactionsResponse) {
      res.json({ transactions: transactionsResponse });
      // TRANSACTIONS LOGGED BELOW! 
      // They will show up in the terminal that you are running nodemon in.
      //console.log(transactionsResponse);
    }
  );
};
module.exports = {
  getTransactions
};