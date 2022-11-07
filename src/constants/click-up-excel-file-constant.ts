export const completedDateColum = 'Task Completion Date';
export const reviewStatus = 'review';
export const closedStatus = 'Closed';
export const openStatus = 'Open';
export const inProgressStatus = 'in progress';
export const allowedNumberOnReviewTasks = 4;
export const totalNumberOfHoursPerDay = 8;
export const minmunWorkingDays = 20;
export const taskClosedStatus = [closedStatus, reviewStatus];

export const codesToProjectMapping: any = {
  'ADMIN/01/2022': [
    'General Activities(Internal)',
    'Administration Department',
    'Social Advocacy',
    'Innovation',
    'Server Administration/Maintenance',
    'Finance Department',
    '[Archived] Management & coordination related activities'
  ],
  'UIO/02/2022': [
    'General HISP Support (UiO)',
    'GAVI Global',
    'GAVI TCA',
    'Unicef Somalia',
    'Unicef Apps Development',
    'Research Projects',
    '[Archived] Kenya Country Support',
    '[Archived] Tanzania Mainland Country support',
    '[Archived] South Sudan Country support',
    '[Archived] Somalia Country support',
    '[Archived] Zanzibar Country support',
    '[Archived] Eritrea Country Support',
    '[Archived] Academy and Material Development',
    '[Archived] Chanjo Covid - Tanzania Main land'
  ],
  'EGPAF/03/2022': ['EGPAF'],
  'KBL/04/2022': ['USAID KB'],
  'JHU-TVCA/05/2022': ['Chandarua Klinik Dashboard'],
  'MDH-POEZNZ/06/2022': ['Zanzibar POE System (MDH)'],
  'GIZ/07/2022': [],
  'PMI-TMSA/16/2022': ['Shinda Malaria'],
  'RTI/12/2022': ['CARPHA RTI'],
  'TMEA-EACPass/08/2022': ['EAC Pass Integration'],
  'GF-SEAF-HUB/09/2022': ['Global Fund Hub work'],
  'PSI-MSDQI/10/2022': ['Zamep MSDQI'],
  'WDF/11/2022': ['World Diabetes Foundation']
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
