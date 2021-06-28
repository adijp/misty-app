import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import { QuickstartProvider } from "./PlaidContext/";
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <QuickstartProvider>
      <App></App>
    </QuickstartProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
