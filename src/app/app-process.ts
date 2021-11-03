import _ from 'lodash';
import {
  assigneeColumn,
  dateFielsColumns
} from '../constants/click-up-excel-file-constant';
import { AppUtil } from '../utils/app-util';
import { ClickUpReportUtil } from '../utils/click-report-util';
import { ExcelUtil } from '../utils/excel-util';
import { LogsUtil } from '../utils/logs-util';

export class AppProcess {
  private _reportGeneratedDate: Date;
  private _tasks!: any[];
  private _reportFile;
  private _clickUpReportFile;
  private excelUtil: ExcelUtil;
  private logsUtil: LogsUtil;
  constructor(
    reportGeneratedDate: Date = new Date(),
    inputExcelFile: string = 'task_list'
  ) {
    this._reportGeneratedDate = reportGeneratedDate;
    this._reportFile = `click-up-summary-report-as_of_${
      reportGeneratedDate.toISOString().split('T')[0]
    }`;
    this._clickUpReportFile = `click-up-source-file-as_of_${
      reportGeneratedDate.toISOString().split('T')[0]
    }`;
    this.excelUtil = new ExcelUtil(inputExcelFile);
    this.logsUtil = new LogsUtil();
  }

  get reportGeneratedDate(): Date {
    return new Date(this._reportGeneratedDate);
  }

  async generateTaskSummary() {
    try {
      const overallSummary = this.overallTaskSummary();
      const projectSummary = this.overallTaskByProjectSummary();
      const individualSummary = this.overallTaskByAssignedSummary();
      const jsonDataObject = {
        overallSummary,
        individualSummary,
        projectSummary
      };
      await new ExcelUtil(this._reportFile).writeToMultipleSheetExcelFile(
        jsonDataObject,
        true
      );
      await new ExcelUtil(
        this._clickUpReportFile
      ).writeToMultipleSheetExcelFile(jsonDataObject, false);
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setAllTask'
      );
    }
  }

  overallTaskSummary(): any {
    const summaryJson: any[] = [];
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
          item2: `${clickUpReportUtil.inProgressStatusTasksCount}`,
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
          item3: `${projectClickUpReportUtil.inProgressStatusTasksCount}`,
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
          { item1: '' },
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
            item2: `${assigneeClickUpReportUtil.inProgressStatusTasksCount}`,
            item3: `${assigneeClickUpReportUtil.onReviewTasksCount}`,
            item4: `${assigneeClickUpReportUtil.onCloseTasksCount}`,
            item5: `${assigneeClickUpReportUtil.totalTasks}`
          },
          { item1: `` },
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
          { item1: '' },
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
            item2: `${projectClickUpReportUtil.inProgressStatusTasksCount}`,
            item3: `${projectClickUpReportUtil.onReviewTasksCount}`,
            item4: `${projectClickUpReportUtil.onCloseTasksCount}`,
            item5: `${projectClickUpReportUtil.totalTasks}`
          },
          { item1: `` },
          { item1: 'Distribution by Assignee and status' },
          {
            item1: 'Assignee',
            item2: 'Completeness',
            item3: 'Timeliness',
            item4: 'Open',
            item5: 'In Progress',
            item6: 'On review',
            item7: 'Closed/Completed',
            item8: 'Total'
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
            item4: `${assigneeClickUpReportUtil.openTasksCount}`,
            item5: `${assigneeClickUpReportUtil.inProgressStatusTasksCount}`,
            item6: `${assigneeClickUpReportUtil.onReviewTasksCount}`,
            item7: `${assigneeClickUpReportUtil.onCloseTasksCount}`,
            item8: `${assigneeClickUpReportUtil.totalTasks}`
          });
        }
        summaryJson.push({ item1: '' });
      }
    } catch (error) {}
    return summaryJson;
  }

  async setAllTask() {
    try {
      await this.logsUtil.addLogs(
        'info',
        'Preparing Tasks for report generation',
        'setAllTask'
      );
      const tasksObject = await this.excelUtil.getJsonDataFromExcelOrCsvFile();
      this._tasks = _.flattenDeep(
        _.map(
          _.flattenDeep(
            _.map(_.keys(tasksObject || {}), (key) => {
              return _.map(tasksObject[key] || [], (task: any) => {
                const formattedTask: any = {};
                for (const colum of _.keys(task)) {
                  let value = task[colum];
                  if (dateFielsColumns.indexOf(colum) > -1) {
                    const reportGeneratedDate = this.reportGeneratedDate;
                    value = AppUtil.getTaskDate(value, reportGeneratedDate);
                  }
                  formattedTask[colum] = value;
                }
                return formattedTask;
              });
            })
          ),
          (task) => {
            const assignees = `${task[assigneeColumn] || ''}`.split(',');
            return _.map(assignees, (assignee) => {
              const formattedTask: any = {};
              formattedTask[assigneeColumn] = `${assignee}`.trim();
              return { ...task, ...formattedTask };
            });
          }
        )
      );
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setAllTask'
      );
    }
  }
}
