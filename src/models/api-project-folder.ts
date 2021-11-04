export interface ApiProjectFolder {
  id: string;
  name: string;
  statuses: Array<ApiProjectStatus>;
  lists?: Array<ApiProjectFolder>;
}

interface ApiProjectStatus {
  id: string;
  status: string;
  color?: string;
}
