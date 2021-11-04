import { ApiProjectUserModel } from './api-project-user-model';

export interface ApiProjectTaskModel {
  id: string;
  name: string;
  description: string;
  status: string;
  createdDate: string;
  dueDate: string | null;
  lastUpdatedDate: string | null;
  startDate: string | null;
  closedDate: string | null;
  completedDate: string | null;
  list: string;
  assignee: ApiProjectUserModel;
  project?: string;
  folder?: string;
}
