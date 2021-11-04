import { ApiProjectUserModel } from './api-project-user-model';

export interface ApiProjectTaskModel {
  id: string;
  name: string;
  description: string;
  status: string;
  createdDate: string | null;
  dueDate: string | null;
  lastUpdatedDate: string | null;
  startDate: string | null;
  closedDate: string | null;
  completedDate: string | null;
  list: string;
  space: string;
  assignees: Array<ApiProjectUserModel>;
  project?: string;
  folder?: string;
}
