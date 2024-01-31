import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import OrchestrationModel from "../models/orchestration";
import OrchestrationStatus from "../models/orchestration_status";

export type IntroPageCompletionCallback = (arg: OrchestrationModel) => void;
export interface IntroPageProps {
  callback: IntroPageCompletionCallback;
}

function IntroPage({ callback }: IntroPageProps) {
  const siteKey: string = process.env.CAPTCHA_SITE_KEY || "";

  async function checkStatusUntilVerified(
    orchestrationModel: OrchestrationModel
  ) {
    const uri = orchestrationModel.statusQueryGetUri;
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const statusResponse = (await response.json()) as OrchestrationStatus;
    if (statusResponse.customStatus === "CAPTCHA_VERIFIED") {
      callback(orchestrationModel);
    } else {
      setTimeout(() => checkStatusUntilVerified(orchestrationModel), 1000);
    }
  }

  async function onCaptchaChange(value: any) {
    const rootUri = process.env.API_ROOT || window.location.origin;
    const url = `${rootUri}/api/MyFunctionOrchestration_HttpStart`;
    const data = JSON.stringify(value);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const jsonResponse = (await response.json()) as OrchestrationModel;
    console.log(jsonResponse);
    setTimeout(() => checkStatusUntilVerified(jsonResponse), 500);
  }

  return (
    <div>
      <ReCAPTCHA sitekey={siteKey} onChange={onCaptchaChange} />
    </div>
  );
}

export default IntroPage;
