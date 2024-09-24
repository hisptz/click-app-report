import _ from 'lodash';
import {
  ADMIN_SUB_FOLDER,
  CLICK_UP_REPORT_SOURCE_COLUMNS,
  REPORTS_SUB_FOLDER,
  TIMESHEETS_SUB_FOLDER
} from '../constants/click-up-excel-file-constant';
import { ApiConfigModel } from '../models/api-config-model';
import { ApiProjectFolderModel } from '../models/api-project-folder-model';
import { ApiProjectTaskModel } from '../models/api-project-task-model';
import { ApiUtil } from '../utils/api-util';
import { AppUtil } from '../utils/app-util';
import { ClickUpReportUtil } from '../utils/click-report-util';
import { ExcelUtil } from '../utils/excel-util';
import { LogsUtil } from '../utils/logs-util';
import { ApiProjectUserModel } from '../models/api-project-user-model';
import { AppProcessUtil } from '../utils/app-process-util';

export class AppProcess {
  private _workingDays: number;
  private _workspaceFolders!: Array<ApiProjectFolderModel>;
  private _tasks!: Array<ApiProjectTaskModel>;
  private _users: Array<ApiProjectUserModel>;
  private _reportFile: string;
  private _clickUpReportFile: string;
  private _payRollReportFile: string;
  private logsUtil: LogsUtil;
  private apiUtil: ApiUtil;

  constructor(apiConfig: ApiConfigModel, workingDays: number) {
    this._workingDays = workingDays;
    this._reportFile = `click-up-summary-report`;
    this._clickUpReportFile = `click-up-source-file`;
    this._payRollReportFile = `staff-payroll-report`;
    this._workspaceFolders = [];
    this._tasks = [];
    this._users = [];
    this.apiUtil = new ApiUtil(apiConfig);
    this.logsUtil = new LogsUtil();
  }

  async setWorkSpaceUsers() {
    try {
      await this.logsUtil.addLogs(
        'info',
        'Preparing Workspac user list',
        'setWorkspaceFolder'
      );
      this._users = await this.apiUtil.getProjectUsers();
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setWorkspaceFolder'
      );
    }
  }

  async setWorkspaceFolders() {
    try {
      await this.logsUtil.addLogs(
        'info',
        'Preparing Workspace folder structure',
        'setWorkspaceFolder'
      );
      this._workspaceFolders = await this.apiUtil.getProjectFolderList();
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setWorkspaceFolder'
      );
    }
  }

  async setAllTask(fromDueDateLimit: number, toDueDateLimit: number) {
    try {
      await this.logsUtil.addLogs(
        'info',
        'Preparing Tasks for report generation',
        'setAllTask'
      );
      let continueFetch = true;
      let page = 0;
      while (continueFetch) {
        const tasks: ApiProjectTaskModel[] = await this.apiUtil.getProjectTasks(
          fromDueDateLimit,
          toDueDateLimit,
          page
        );
        if (tasks.length > 0) {
          this._tasks = _.uniqBy([...this._tasks, ...tasks], 'id');
        }
        continueFetch = tasks.length > 0;
        page++;
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setAllTask'
      );
    }
  }

  async generateWorkSpaceFolderReport() {
    try {
      await this.logsUtil.addLogs(
        'info',
        'Generating Workspace folder structure',
        'generateWorkSpaceFolderReport'
      );
      const jsonData = _.flattenDeep(
        _.map(
          this._workspaceFolders,
          (workspaceFolder: ApiProjectFolderModel) => {
            return [
              { project: workspaceFolder.name, subProject: '' },
              ..._.map(
                workspaceFolder.lists || [],
                (workspaceList: ApiProjectFolderModel) => {
                  return { project: '', subProject: workspaceList.name };
                }
              ),
              { project: '', subProject: '' }
            ];
          }
        )
      );
      await new ExcelUtil(
        'Project workspace',
        ADMIN_SUB_FOLDER
      ).writeToSingleSheetExcelFile(jsonData, true, 'Project');
      const users: Array<ApiProjectUserModel> =
        await this.apiUtil.getProjectUsers();
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'generateWorkSpaceFolderReport'
      );
    }
  }

  async generateWorkSpaceUserReport() {
    try {
      await this.logsUtil.addLogs(
        'info',
        'Generating Workspace user list report',
        'generateWorkSpaceUserReport'
      );
      await new ExcelUtil(
        'Workspace Users',
        ADMIN_SUB_FOLDER
      ).writeToSingleSheetExcelFile(this._users, false, 'User List');
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'generateWorkSpaceUserReport'
      );
    }
  }

  async generateSourceReportFile() {
    try {
      const clickUpReportUtil = new ClickUpReportUtil(
        this._tasks,
        CLICK_UP_REPORT_SOURCE_COLUMNS
      );
      await new ExcelUtil(
        this._clickUpReportFile,
        REPORTS_SUB_FOLDER
      ).writeToSingleSheetExcelFile(clickUpReportUtil.toExcelJson, false);
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'generateSourceReportFile'
      );
    }
  }

  async generateTaskSummary(fromDueDateLimit: number, toDueDateLimit: number) {
    try {
      const fromDate = AppUtil.getFormattedDate(fromDueDateLimit);
      const toDate = AppUtil.getFormattedDate(toDueDateLimit);
      const overallSummary = AppProcessUtil.overallTaskSummary(
        fromDate,
        toDate,
        this._tasks
      );
      const projectSummary = AppProcessUtil.overallTaskByProjectSummary(
        this._tasks
      );
      const individualSummary = AppProcessUtil.overallTaskByAssignedSummary(
        this._tasks
      );
      const dqaSummary = AppProcessUtil.dqaSummary(
        this._workingDays,
        this._tasks
      );
      const individualPayroll = AppProcessUtil.payrollSummayByIndiviadual(
        this._tasks
      );
      const jsonDataObject = {
        'Overall summary': overallSummary,
        'Salaries Breakdown': individualPayroll,
        'Individual summary': individualSummary,
        'Project summary': projectSummary,
        'DQA issues': dqaSummary
      };
      await new ExcelUtil(
        this._reportFile,
        REPORTS_SUB_FOLDER
      ).writeToMultipleSheetExcelFile(jsonDataObject, true);
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'generateTaskSummary'
      );
    }
  }

  async generatePayrollForStaff() {
    try {
      const individualPayroll = AppProcessUtil.payrollSummayByIndiviadual(
        this._tasks
      );
      const jsonDataObject = {
        'Salaries Breakdown': individualPayroll
      };
      await new ExcelUtil(
        this._payRollReportFile,
        REPORTS_SUB_FOLDER
      ).writeToMultipleSheetExcelFile(jsonDataObject, true);
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'generatePayrollForStaff'
      );
    }
  }

  async generateTimeSheetForIndividual(
    fromDueDateLimit: number,
    toDueDateLimit: number
  ) {
    try {
      await this.logsUtil.addLogs(
        'error',
        `Generating Team time sheets`,
        'generateTimeSheetForIndividual'
      );
      const fromDate = AppUtil.getTimeSheetDate(fromDueDateLimit);
      const toDate = AppUtil.getTimeSheetDate(toDueDateLimit);
      const clickUpReportUtil = new ClickUpReportUtil(this._tasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of _.keys(tasksByAssignee).sort()) {
        const summaryJson: any[] = AppProcessUtil.getIndividualTimeSheetSummary(
          fromDate,
          toDate,
          tasksByAssignee,
          assignee
        );
        await new ExcelUtil(
          `[${assignee}]Timesheet`,
          TIMESHEETS_SUB_FOLDER
        ).writeToSingleSheetExcelFile(summaryJson, true);
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'generateTimeSheetForIndividual'
      );
    }
  }
}
