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
  'ADMIN/2024': [
    'General Activities(Internal)',
    'Administration Department',
    'Social Advocacy',
    'Innovation',
    'Server Administration/Maintenance',
    'Finance Department',
    'EAC Pass Integration',
    'EGPAF',
    'Chandarua Klinik Dashboard',
    'CARPHA RTI',
    'Zamep MSDQI',
    'Media & Public Relations'
  ],
  'KB-LESOTHO/2024': ['USAID KB'],
  'GF-SEAF-HUB/2024': ['Global Fund Hub work'],
  'D-COMPASS/2024': ['World Diabetes Foundation'],
  'S-MALARIA/2024': ['Shinda Malaria'],
  'INT-HEALTH/2024': [],
  'Somalia -EIR/2024': [],
  'MDH-ZTHS/2024': ['Zanzibar POE System (MDH)'],
  'KNCV-TB/2024': ['Smart pills ETLs Integration'],
  'STC/2024': [],
  'MoH-IDSR/2024': ['IDSR Dashboards'],
  'ACADEMY/2024': [],
  'MC-BHI/2024': ['BHI South Sudan'],
  'HISP-UIO/2024': [
    'General HISP Support (UiO)',
    'GAVI Global',
    'GAVI TCA',
    'Unicef Somalia',
    'Unicef Apps Development',
    'Research Projects',
    'WHO Pastoralist',
    'CDC CoAg (OneHealth)'
  ],
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
