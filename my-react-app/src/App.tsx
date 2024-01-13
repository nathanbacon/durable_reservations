import React from "react";
import "./App.css";
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const siteKey: string = process.env.CAPTCHA_SITE_KEY || "";
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, world!</h1>
        <ReCAPTCHA sitekey={siteKey} />
      </header>
    </div>
  );
}

export default App;
