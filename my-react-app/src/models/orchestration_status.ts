export default interface OrchestrationStatus {
  name: string;
  instanceId: string;
  runtimeStatus: string;
  input: string;
  customStatus: any;
  output: string[];
  createdTime: string;
  lastUpdatedTime: string;
}
