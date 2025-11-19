export interface Client {
  id: number;
  name: string;
  stage: string;
  stageColor: string;
  lastFollowup: string;
  nextFollowup: string;
  proposalStatus: string;
  statusColor: string;
  projectValue: string;
  valueNumeric: number;
  priority: string;
  daysInPipeline: number;
  firstContactDate: string;
  contactPerson: string;
  email: string;
  phone: string;
  notes: string;
  history: Array<{
    date: string;
    action: string;
    user: string;
  }>;
}
