import React, { useState, useEffect, FormEvent } from "react";
import OrchestrationModel from "../models/orchestration";
import AppointmentRequest from "../models/appointment_requested";

export interface ReservationPageProps {
  orchestrationModel: OrchestrationModel;
}

type DatetimeValue = Date | null;
type StringValue = string | null;

function ReservationPage({ orchestrationModel }: ReservationPageProps) {
  const [appointmentTime, setAppointmentTime] = useState<DatetimeValue>(
    new Date()
  );
  const [email, setEmail] = useState<StringValue>();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!appointmentTime) return;
    if (!email) return;
    const d = appointmentTime;

    const utcNow = new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds()
      )
    );

    const eventUri = orchestrationModel.sendEventPostUri.replace(
      "{eventName}",
      "AppointmentRequested"
    );

    const appointmentRequest: AppointmentRequest = {
      email: email,
      appointmentTime: utcNow.toUTCString(),
    };

    const response = await fetch(eventUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentRequest),
    });

    console.log(response);
  }

  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>Pick a time and date</h2>
      <input
        type="datetime-local"
        onChange={(e) => setAppointmentTime(e.target.valueAsDate)}
      />
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <button onChange={onSubmit} type="button">
        Request Appointment
      </button>
    </form>
  );
}

export default ReservationPage;
