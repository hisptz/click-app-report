import _ from 'lodash';
import {
  ADMIN_SUB_FOLDER,
  CLICK_UP_REPORT_SOURCE_COLUMNS,
  REPORTS_SUB_FOLDER,
  TASK_CLOSED_STATUS,
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

export class AppProcess {
  private _workingDays: number;
  private _workspaceFolders!: Array<ApiProjectFolderModel>;
  private _tasks!: Array<ApiProjectTaskModel>;
  private _users: Array<ApiProjectUserModel>;
  private _reportFile;
  private _clickUpReportFile;
  private logsUtil: LogsUtil;
  private apiUtil: ApiUtil;


  constructor(apiConfig: ApiConfigModel, workingDays: number) {
    this._workingDays = workingDays;
    this._reportFile = `click-up-summary-report`;
    this._clickUpReportFile = `click-up-source-file`;
    this._workspaceFolders = [];
    this._tasks = [];
    this._users = [];
    this.apiUtil = new ApiUtil(apiConfig);
    this.logsUtil = new LogsUtil();
  }

  async setWorkSpaceUsers(){
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
      await new ExcelUtil('Project workspace', ADMIN_SUB_FOLDER).writeToSingleSheetExcelFile(
        jsonData,
        true,
        'Project'
      );
      const users: Array<ApiProjectUserModel> = await this.apiUtil.getProjectUsers();
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
      await new ExcelUtil('Workspace Users', ADMIN_SUB_FOLDER).writeToSingleSheetExcelFile(
        this._users,
        false,
        'User List'
      );
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
        'generateTaskSummary'
      );
    }
  }

  async generateTaskSummary(fromDueDateLimit: number, toDueDateLimit: number) {
    try {
      const fromDate = AppUtil.getFormattedDate(fromDueDateLimit);
      const toDate = AppUtil.getFormattedDate(toDueDateLimit);
      const overallSummary = this.overallTaskSummary(fromDate, toDate);
      const projectSummary = this.overallTaskByProjectSummary();
      const individualSummary = this.overallTaskByAssignedSummary();
      const dqaSummary = this.dqaSummary();
      const jsonDataObject = {
        'Overall summary': overallSummary,
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

  dqaSummary() {
    const summaryJson = [
      { item1: `Expected working days : ${this._workingDays}` },
      {},
      { item1: 'Full Name', item2: 'Number of Days spent' }
    ];
    try {
      const clickUpReportUtil = new ClickUpReportUtil(this._tasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of _.keys(tasksByAssignee)) {
        const tasks = _.filter(
          new ClickUpReportUtil(tasksByAssignee[assignee]).sortedTasksByDate,
          (task) =>
            TASK_CLOSED_STATUS.includes(task.status) &&
            parseFloat(task.timeSpent) > 0
        );
        const numberOfWeekEndDays =
          2 * parseInt(`${this._workingDays / 5}`, 10);
        const assigneeReportUtil = new ClickUpReportUtil(tasks);
        const totalDaysSpent = parseFloat(assigneeReportUtil.totalDaysSpent);
        const maximunDayOffLimit = parseFloat(
          (this._workingDays / 8).toFixed(1)
        );
        if (
          totalDaysSpent + maximunDayOffLimit < this._workingDays ||
          this._workingDays + numberOfWeekEndDays < totalDaysSpent
        ) {
          summaryJson.push({
            item1: `${assignee}`,
            item2: `${totalDaysSpent}`
          });
        }
      }
    } catch (error) {}
    return summaryJson;
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
        const summaryJson: any[] = this.getIndividualTimeSheetSummary(
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

  getIndividualTimeSheetSummary(
    fromDate: string,
    toDate: string,
    tasksByAssignee: any,
    assignee: string
  ) {
    const summaryJson: any[] = [
      {
        item1: ``
      },
      {
        item1: `P O Box 31775 Dar Es Salaam`
      },
      {
        item1: `Activities Monthly Timesheet from ${fromDate} to ${toDate}`
      },
      {
        item1: `Date`,
        item2: `Section`,
        item3: `Activity Description`,
        item4: `No of Hours`
      }
    ];
    const tasks = _.filter(
      new ClickUpReportUtil(tasksByAssignee[assignee]).sortedTasksByDate,
      (task) =>
        TASK_CLOSED_STATUS.includes(task.status) &&
        parseFloat(task.timeSpent) > 0
    );
    const timeSheetReportUtil = new ClickUpReportUtil(tasks);
    for (const task of timeSheetReportUtil.sortedTasksByDate) {
      summaryJson.push({
        item1: AppUtil.getTimeSheetDate(task.dueDate),
        item2: task.projectCode,
        item3: task.name,
        item4: task.timeSpent
      });
    }
    summaryJson.push(
      {
        item1: ``,
        item2: ``,
        item3: `Total Hours`,
        item4: `${timeSheetReportUtil.totalHoursSpent}`
      },
      {
        item1: ``,
        item2: ``,
        item3: `Total Number of Days`,
        item4: `${timeSheetReportUtil.totalDaysSpent}`
      },
      { item1: '' },
      {
        item1: `Submitted By:`,
        item2: `${assignee}`,
        item3: ``,
        item4: ``
      },
      {
        item1: ``,
        item2: ``,
        item3: `I certify that the time reported on this time sheet is accurate and complete to the best of my knowledge`,
        item4: ``
      },
      {
        item1: `Approved By:`,
        item2: ``,
        item3: ``,
        item4: ``
      },
      {
        item1: ``,
        item2: ``,
        item3: `I have reviewed this time sheet and certify that it is accurate and complete to the best of my knowledge`,
        item4: ``
      }
    );
    return summaryJson;
  }

  overallTaskSummary(fromDate: string, toDate: string): any {
    const summaryJson: any[] = [
      {
        item1: `Click up report of activities from ${fromDate} to ${toDate}`
      },
      { item1: `` }
    ];
    try {
      const clickUpReportUtil = new ClickUpReportUtil(this._tasks);
      summaryJson.push({
        item1: 'Overall Summary'
      });
      summaryJson.push(
        {
          item1: 'Completeness',
          item2: `${clickUpReportUtil.tasksCompletenesRate}%`
        },
        {
          item1: 'Timeliness',
          item2: `${clickUpReportUtil.tasksTimelinessRate}%`
        },
        {
          item1: 'Total Hours Spent',
          item2: `${clickUpReportUtil.totalHoursSpent}`
        },
        {
          item1: 'Total Days Spent',
          item2: `${clickUpReportUtil.totalDaysSpent}`
        },
        { item1: '' },
        { item1: 'Overall Distribution by Status' },
        {
          item1: 'Open',
          item2: 'In Progress',
          item3: 'On review',
          item4: 'Closed/Completed',
          item5: 'Total'
        },
        {
          item1: `${clickUpReportUtil.openTasksCount}`,
          item2: `${clickUpReportUtil.IN_PROGRESS_STATUSTasksCount}`,
          item3: `${clickUpReportUtil.onReviewTasksCount}`,
          item4: `${clickUpReportUtil.onCloseTasksCount}`,
          item5: `${clickUpReportUtil.totalTasks}`
        },
        { item1: '' },
        { item1: 'Overall Distribution by Project/List Name' },
        {
          item1: 'Project/List Name',
          item2: 'Open',
          item3: 'In Progress',
          item4: 'On review',
          item5: 'Closed/Completed',
          item6: 'Total'
        }
      );
      const tasksByProjectList = clickUpReportUtil.tasksByProject;
      for (const project of _.keys(tasksByProjectList).sort()) {
        const projectClickUpReportUtil = new ClickUpReportUtil(
          tasksByProjectList[project]
        );
        summaryJson.push({
          item1: `${project}`,
          item2: `${projectClickUpReportUtil.openTasksCount}`,
          item3: `${projectClickUpReportUtil.IN_PROGRESS_STATUSTasksCount}`,
          item4: `${projectClickUpReportUtil.onReviewTasksCount}`,
          item5: `${projectClickUpReportUtil.onCloseTasksCount}`,
          item6: `${projectClickUpReportUtil.totalTasks}`
        });
      }
    } catch (error) {}
    return summaryJson;
  }

  overallTaskByAssignedSummary(): any {
    const summaryJson: any[] = [];
    try {
      const clickUpReportUtil = new ClickUpReportUtil(this._tasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of _.keys(tasksByAssignee).sort()) {
        const assigneeClickUpReportUtil = new ClickUpReportUtil(
          tasksByAssignee[assignee]
        );
        summaryJson.push(
          { item1: `${assignee}` },
          {
            item1: 'Completeness',
            item2: `${assigneeClickUpReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${assigneeClickUpReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${assigneeClickUpReportUtil.totalHoursSpent}`
          },
          {
            item1: 'Total Days Spent',
            item2: `${assigneeClickUpReportUtil.totalDaysSpent}`
          },
          { item1: 'Distribution by Status' },
          {
            item1: 'Open',
            item2: 'In Progress',
            item3: 'On review',
            item4: 'Closed/Completed',
            item5: 'Total'
          },
          {
            item1: `${assigneeClickUpReportUtil.openTasksCount}`,
            item2: `${assigneeClickUpReportUtil.IN_PROGRESS_STATUSTasksCount}`,
            item3: `${assigneeClickUpReportUtil.onReviewTasksCount}`,
            item4: `${assigneeClickUpReportUtil.onCloseTasksCount}`,
            item5: `${assigneeClickUpReportUtil.totalTasks}`
          },
          { item1: 'Distribution by Project/List Name' }
        );
        const tasksByProjectList = assigneeClickUpReportUtil.tasksByProject;
        for (const project of _.keys(tasksByProjectList).sort()) {
          const projectClickUpReportUtil = new ClickUpReportUtil(
            tasksByProjectList[project]
          );
          summaryJson.push({
            item1: `${project}`,
            item2: `${projectClickUpReportUtil.totalTasks}`
          });
        }
        summaryJson.push({ item1: '' });
      }
    } catch (error) {}
    return summaryJson;
  }

  overallTaskByProjectSummary(): any {
    const summaryJson: any[] = [];
    try {
      const clickUpReportUtil = new ClickUpReportUtil(this._tasks);
      const tasksByProjectList = clickUpReportUtil.tasksByProject;
      for (const project of _.keys(tasksByProjectList).sort()) {
        const projectClickUpReportUtil = new ClickUpReportUtil(
          tasksByProjectList[project]
        );
        summaryJson.push(
          { item1: `${project}` },
          {
            item1: 'Completeness',
            item2: `${projectClickUpReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${projectClickUpReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${projectClickUpReportUtil.totalHoursSpent}`
          },
          {
            item1: 'Total Days Spent',
            item2: `${projectClickUpReportUtil.totalDaysSpent}`
          },
          { item1: 'Distribution by Status' },
          {
            item1: 'Open',
            item2: 'In Progress',
            item3: 'On review',
            item4: 'Closed/Completed',
            item5: 'Total'
          },
          {
            item1: `${projectClickUpReportUtil.openTasksCount}`,
            item2: `${projectClickUpReportUtil.IN_PROGRESS_STATUSTasksCount}`,
            item3: `${projectClickUpReportUtil.onReviewTasksCount}`,
            item4: `${projectClickUpReportUtil.onCloseTasksCount}`,
            item5: `${projectClickUpReportUtil.totalTasks}`
          },
          { item1: 'Distribution by Assignee and status' },
          {
            item1: 'Assignee',
            item2: 'Completeness',
            item3: 'Timeliness',
            item4: 'Hours Spent',
            item5: 'Open',
            item6: 'In Progress',
            item7: 'On review',
            item8: 'Closed/Completed',
            item9: 'Total'
          }
        );
        const tasksByAssignee = projectClickUpReportUtil.tasksByAssignee;
        for (const assignee of _.keys(tasksByAssignee).sort()) {
          const assigneeClickUpReportUtil = new ClickUpReportUtil(
            tasksByAssignee[assignee]
          );
          summaryJson.push({
            item1: `${assignee}`,
            item2: `${assigneeClickUpReportUtil.tasksCompletenesRate}`,
            item3: `${assigneeClickUpReportUtil.tasksTimelinessRate}`,
            item4: `${assigneeClickUpReportUtil.totalHoursSpent}`,
            item5: `${assigneeClickUpReportUtil.openTasksCount}`,
            item6: `${assigneeClickUpReportUtil.IN_PROGRESS_STATUSTasksCount}`,
            item7: `${assigneeClickUpReportUtil.onReviewTasksCount}`,
            item8: `${assigneeClickUpReportUtil.onCloseTasksCount}`,
            item9: `${assigneeClickUpReportUtil.totalTasks}`
          });
        }
        summaryJson.push({ item1: '' });
      }
    } catch (error) {}
    return summaryJson;
  }
}
