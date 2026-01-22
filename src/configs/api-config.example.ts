import { ApiConfigModel, EmailConfigModel } from '../models';

export const apiConfig: ApiConfigModel = {
  teamId: 'team-id-from-click-up',
  authorizationKey: 'click-up-generated-key',
  appBaseUrl: 'https://api.clickup.com/api/v2',
  isGroupedTimeSheets: false,
  selectedProjects: []
};

export const emailConfig: EmailConfigModel = {
  senderName: '',
  senderEmail: '',
  password: '',
  adminEmails: [], // emails adresses to admin reports send the report
  managementEmails: [], // email addresses to management reports send the report
};
