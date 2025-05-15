export const TIMESHEETS_SUB_FOLDER = 'timesheets';
export const REPORTS_SUB_FOLDER = 'reports';
export const SUMMARY_REPORTS_SUB_FOLDER = 'summary-reports';
export const ADMIN_SUB_FOLDER = 'admin';
export const EXCEL_FOLDER = 'excels';

export const COMPLETED_DATE_COLUMN = 'Task Completion Date';
export const REVIEW_STATUS = 'review';
export const CLOSED_STATUS = 'Closed';
export const OPEN_STATUS = 'Open';
export const IN_PROGRESS_STATUS = 'in progress';
export const ALLOWED_NUMBER_ON_REVIEW_TASKS = 4;
export const TOTAL_NUMBER_OF_HOURS_PER_DAY = 8;
export const MINIMUM_WORKING_DAYS = 20;
export const MINIMUM_LAST_DAYS_REPORT_GENERATION = 7;
export const TASK_CLOSED_STATUS = [CLOSED_STATUS, REVIEW_STATUS];

export const CODES_TO_PROJECT_MAPPING: any = {
  'HISP- UIO/2025': [
    'Climate & Health',
    'GAVI Global - Data Use Apps',
    'GAVI Global - WHO Afro',
    'GAVI TCA - Eritrea',
    'GAVI TCA - Somalia',
    'GAVI TCA - South Sudan',
    'GAVI TCA - Tanzania',
    'General HISP Support (UiO)'
  ],
  'DHIS2-Messenger/2025': ['DHIS2 Analytics Messenger'],
  'PATH - TIMR/2025': ['TimR V2']
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
