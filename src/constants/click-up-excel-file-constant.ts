export const completedDateColum = 'Task Completion Date';
export const reviewStatus = 'review';
export const closedStatus = 'Closed';
export const openStatus = 'Open';
export const inProgressStatus = 'in progress';
export const allowedNumberOnReviewTasks = 4;
export const totalNumberOfHoursPerDay = 8;
export const taskClosedStatus = [closedStatus, reviewStatus];

export const codesToProjectMapping: any = {
  'ADMIN/01/2021': [
    'Management & coordination related activities',
    'Social Advocacy',
    'Innovation',
    'Server Administration/Maintenance',
    'Finance Department',
    'Administration Department'
  ],
  'UIO/02/2021': [
    'Eritrea Country Support',
    'Kenya Country Support',
    'Research Projects',
    'Unicef Apps',
    'Academy and Material Development',
    'South Sudan Country support',
    'Somalia Country support',
    'Tanzania Mainland Country support',
    'Zanzibar Country support'
  ],
  'EGPAF/03/2021': [],
  'STC/04/2021': [],
  'KBL/05/2021': ['USAID KB'],
  'ZNZLLIN/06/2021': ['Gidehouse LLP'],
  'JHU/07/2021': [],
  'MDH/08/2021': ['Zanzibar support (MDH)']
};

export const clickUpReportSourceColumns: any = {
  project: 'PROJECT',
  list: 'SUB PROJECT',
  assignee: 'ASSIGNEE',
  name: 'TASK NAME',
  status: 'STATUS',
  createdDate: 'CREATE DATE',
  dueDate: 'DUE DATE',
  lastUpdatedDate: 'LAST UPDATED DATE',
  completedDate: 'ON REVIEW DATE',
  closedDate: 'CLOSE DATE',
  timeSpent: 'NUMBER OF HOURS SPENT'
};
