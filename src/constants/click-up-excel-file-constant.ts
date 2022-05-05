export const completedDateColum = 'Task Completion Date';
export const reviewStatus = 'review';
export const closedStatus = 'Closed';
export const openStatus = 'Open';
export const inProgressStatus = 'in progress';
export const allowedNumberOnReviewTasks = 4;
export const totalNumberOfHoursPerDay = 8;
export const minmunWorkingDays = 20;
export const maximunDayOffLimit = 2;
export const taskClosedStatus = [closedStatus, reviewStatus];

export const codesToProjectMapping: any = {
  'ADMIN/01/2022': [
    'Management & coordination related activities',
    'Social Advocacy',
    'Innovation',
    'Server Administration/Maintenance',
    'Finance Department',
    'Administration Department'
  ],
  'PSI-MSDQI/10/2022': ['Zamep MSDQI'],
  'TMEA-EACPass/08/2022': ['EAC Pass Integration'],
  'UIO/02/2022': [
    'Eritrea Country Support',
    'Kenya Country Support',
    'Research Projects',
    'Unicef Apps',
    'Academy and Material Development',
    'South Sudan Country support',
    'Somalia Country support',
    'Tanzania Mainland Country support',
    'Zanzibar Country support',
    'Chanjo Covid - Tanzania Main land'
  ],
  'EGPAF/03/2022': [],
  'KBL/04/2022': ['USAID KB'],
  'JHU-TVCA/05/2022': ['Chandarua Klinik Dashboard'],
  'MDH-POEZNZ/06/2022': ['Zanzibar POE System (MDH)'],
  'GIZ/07/2022': []
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
