import React from "react";
import "./App.css";
import IntroPage, { IntroPageCompletionCallback } from "./modules/IntroPage";

function App() {
  const siteKey: string = process.env.CAPTCHA_SITE_KEY || "";

  function renderPage() {
    return <IntroPage callback={(_: IntroPageCompletionCallback) => {}} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, world!</h1>
      </header>
    </div>
  );
}

export default App;
