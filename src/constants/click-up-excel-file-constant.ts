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
  'ADMIN/2023': [
    'General Activities(Internal)',
    'Administration Department',
    'Social Advocacy',
    'Innovation',
    'Server Administration/Maintenance',
    'Finance Department',
    'Zanzibar POE System (MDH)',
    'EAC Pass Integration',
    'EGPAF',
    'Chandarua Klinik Dashboard',
    'CARPHA RTI',
    'Zamep MSDQI'
  ],
  'HISP- UIO/2023': [
    'General HISP Support (UiO)',
    'GAVI Global',
    'GAVI TCA',
    'Unicef Somalia',
    'Unicef Apps Development',
    'Research Projects',
    'WHO Pastoralist'
  ],
  'KB-LESOTHO/2023': ['USAID KB'],
  'GF-SEAF-HUB/2023': ['Global Fund Hub work'],
  'D-COMPASS/2023': ['World Diabetes Foundation'],
  'S-MALARIA/2023': ['Shinda Malaria'],
  'C/COVID/2023': [],
  '': [
    '[Archived] Management & coordination related activities',

    '[Archived] Management & coordination related activities',
    '[Archived] Kenya Country Support',
    '[Archived] Tanzania Mainland Country support',
    '[Archived] South Sudan Country support',
    '[Archived] Somalia Country support',
    '[Archived] Zanzibar Country support',
    '[Archived] Eritrea Country Support',
    '[Archived] Academy and Material Development',
    '[Archived] Chanjo Covid - Tanzania Main land'
  ]
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
