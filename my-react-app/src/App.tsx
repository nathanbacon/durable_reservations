import React from "react";
import "./App.css";
import IntroPage, { IntroPageCompletionCallback } from "./modules/IntroPage";
import OrchestrationStart from "./models/orchestration_start";

function App() {
  const siteKey: string = process.env.CAPTCHA_SITE_KEY || "";

  function renderPage() {
    return <IntroPage callback={(_: OrchestrationStart) => {}} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, world!</h1>
      </header>
      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
