export const TIMESHEETS_SUB_FOLDER = 'timesheets';
export const REPORTS_SUB_FOLDER = 'reports';

export const COMPLETED_DATE_COLUMN = 'Task Completion Date';
export const REVIEW_STATUS = 'review';
export const CLOSED_STATUS = 'Closed';
export const OPEN_STATUS = 'Open';
export const IN_PROGRESS_STATUS = 'in progress';
export const ALLOWED_NUMBER_ON_REVIEW_TASKS = 4;
export const TOTAL_NUMBER_OF_HOURS_PER_DAY = 8;
export const MINIMUM_WORKING_DAYS = 20;
export const TASK_CLOSED_STATUS = [CLOSED_STATUS, REVIEW_STATUS];

export const CODES_TO_PROJECT_MAPPING: any = {
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

export const CLICK_UP_REPORT_SOURCE_COLUMNS: any = {
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
