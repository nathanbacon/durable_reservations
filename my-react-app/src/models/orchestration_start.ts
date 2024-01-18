interface OrchestrationStart {
  statusQueryGetUri: string,
  sendEventPostUri: string,
  resumePostUri: string,
  terminatePostUri: string,
  purgeHistoryDeleteUri: string,
  restartPostUri: string,
}

export default OrchestrationStart;

Object { id: "bdc531e71070406bbdecab581999c288", statusQueryGetUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288?taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==", sendEventPostUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288/raiseEvent/{eventName}?taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==", terminatePostUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288/terminate?reason={text}&taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==", purgeHistoryDeleteUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288?taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==", restartPostUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288/restart?taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==", suspendPostUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288/suspend?reason={text}&taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==", resumePostUri: "http://localhost:7071/runtime/webhooks/durabletask/instances/bdc531e71070406bbdecab581999c288/resume?reason={text}&taskHub=TestHubName&connection=Storage&code=s7l6wlYGJITyd4tkEQM5ZQ2J6Ntdz0E0gvmdWVQ2soobAzFut99RYw==" }
index:1526:29
