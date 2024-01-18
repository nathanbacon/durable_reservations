interface OrchestrationStart {
  statusQueryGetUri: string;
  sendEventPostUri: string;
  resumePostUri: string;
  terminatePostUri: string;
  purgeHistoryDeleteUri: string;
  restartPostUri: string;
}

export default OrchestrationStart;
