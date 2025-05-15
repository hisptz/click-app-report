import { keys } from 'lodash';
import {
  CLICK_UP_REPORT_SOURCE_COLUMNS,
  REPORTS_SUB_FOLDER,
  SUMMARY_REPORTS_SUB_FOLDER,
  TIMESHEETS_SUB_FOLDER
} from '../constants';
import { ApiProjectTaskModel } from '../models';
import {
  AppProcessUtil,
  AppUtil,
  ExcelUtil,
  LogsUtil,
  ReportUtil,
  TaskUtil
} from '../utils';

export class TaskProcess {
  private _reportFile: string = `click-up-summary-report`;
  private _clickUpReportFile: string = `click-up-source-file`;
  private _payRollReportFile: string = `staff-payroll-report`;

  constructor() {}

  async startTaskProcess() {
    const taskUtil = new TaskUtil();
    const tasks: Array<ApiProjectTaskModel> =
      await taskUtil.getAllProjectTasks();
    if (tasks.length > 0) {
      await this.generateTaskSummary(tasks);
      await this.generatePayrollForStaff(tasks);
      await this.generateTimeSheetForIndividual(tasks);
      await this.generateSourceReportFile(tasks);
    }
  }

  async generateSourceReportFile(tasks: Array<ApiProjectTaskModel>) {
    try {
      const reportUtil = new ReportUtil(tasks, CLICK_UP_REPORT_SOURCE_COLUMNS);
      await new ExcelUtil(
        this._clickUpReportFile,
        REPORTS_SUB_FOLDER
      ).writeToSingleSheetExcelFile(reportUtil.toExcelJson, false);
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        '_generateSourceReportFile'
      );
    }
  }

  async generateTaskSummary(tasks: Array<ApiProjectTaskModel>) {
    try {
      const { fromDueDateLimit, toDueDateLimit, workingDays } =
        AppUtil.getStartEndDateLimit();
      const fromDate = AppUtil.getFormattedDate(fromDueDateLimit);
      const toDate = AppUtil.getFormattedDate(toDueDateLimit);
      const overallSummary = AppProcessUtil.overallTaskSummary(
        fromDate,
        toDate,
        tasks
      );
      const projectSummary = AppProcessUtil.overallTaskByProjectSummary(tasks);
      const individualSummary =
        AppProcessUtil.overallTaskByAssignedSummary(tasks);
      const dqaSummary = AppProcessUtil.dqaSummary(workingDays, tasks);
      const jsonDataObject = {
        'Overall summary': overallSummary,
        'Individual summary': individualSummary,
        'Project summary': projectSummary,
        'DQA issues': dqaSummary
      };
      await new ExcelUtil(
        this._reportFile,
        SUMMARY_REPORTS_SUB_FOLDER
      ).writeToMultipleSheetExcelFile(jsonDataObject, true);
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'generateTaskSummary'
      );
    }
  }

  async generatePayrollForStaff(tasks: Array<ApiProjectTaskModel>) {
    try {
      const individualPayroll =
        AppProcessUtil.payrollSummayByIndiviadual(tasks);
      const jsonDataObject = {
        'Salaries Breakdown': individualPayroll
      };
      await new ExcelUtil(
        this._payRollReportFile,
        REPORTS_SUB_FOLDER
      ).writeToMultipleSheetExcelFile(jsonDataObject, true);
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'generatePayrollForStaff'
      );
    }
  }

  async generateTimeSheetForIndividual(tasks: Array<ApiProjectTaskModel>) {
    try {
      await new LogsUtil().addLogs(
        'error',
        `Generating Team time sheets`,
        'generateTimeSheetForIndividual'
      );
      const { fromDueDateLimit, toDueDateLimit } =
        AppUtil.getStartEndDateLimit();
      const fromDate = AppUtil.getTimeSheetDate(fromDueDateLimit);
      const toDate = AppUtil.getTimeSheetDate(toDueDateLimit);
      const reportUtil = new ReportUtil(tasks);
      const tasksByAssignee = reportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee).sort()) {
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
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'generateTimeSheetForIndividual'
      );
    }
  }
}
