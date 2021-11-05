export interface ApiProjectFolderModel {
  id: string;
  name: string;
  statuses: Array<ApiProjectStatusModel>;
  lists?: Array<ApiProjectFolderModel>;
}

interface ApiProjectStatusModel {
  id: string;
  status: string;
  color?: string;
}
