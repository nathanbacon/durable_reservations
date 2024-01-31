import React, { useState } from "react";
import "./App.css";
import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import IntroPage from "./pages/IntroPage";
import OrchestrationModel from "./models/orchestration";
import ReservationPage from "./pages/ReservationPage";

function App() {
  const [orchestrationModel, setOrchestrationModel] =
    useState<OrchestrationModel>();

  function onOrchestrationStart(orch: OrchestrationModel) {
    setOrchestrationModel(orch);
  }

  function renderPage() {
    if (!orchestrationModel) {
      return <IntroPage callback={onOrchestrationStart} />;
    }

    return <ReservationPage orchestrationModel={orchestrationModel} />;
  }

  return (
    <div className="app">
      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
