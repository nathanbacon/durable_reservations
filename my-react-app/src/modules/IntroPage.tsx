import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import OrchestrationStart from "../models/orchestration_start";

export type IntroPageCompletionCallback = (arg: OrchestrationStart) => void;
export interface IntroPageProps {
  callback: IntroPageCompletionCallback;
}

function IntroPage({ callback }: IntroPageProps) {
  const siteKey: string = process.env.CAPTCHA_SITE_KEY || "";

  async function onCaptchaChange(value: any) {
    console.log(value);
    const rootUri = process.env.ROOT_URI;
    const url = `${rootUri}/api/MyFunctionOrchestration_HttpStart`;
    const data = JSON.stringify(value);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const jsonResponse = (await response.json()) as OrchestrationStart;
    console.log(jsonResponse);
    callback(jsonResponse);
  }

  return (
    <div>
      <ReCAPTCHA sitekey={siteKey} onChange={onCaptchaChange} />
    </div>
  );
}

export default IntroPage;
