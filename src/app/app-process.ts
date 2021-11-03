import _ from 'lodash';
import {
  assigneeColumn,
  dateFielsColumns,
  taskListColum
} from '../constants/click-up-excel-file-constant';
import { AppUtil } from '../utils/app-util';
import { ClickUpReportUtil } from '../utils/click-report-util';
import { ExcelUtil } from '../utils/excel-util';
import { LogsUtil } from '../utils/logs-util';

export class AppProcess {
  private _reportGeneratedDate: Date;
  private _tasks!: any[];

  private excelUtil: ExcelUtil;
  private logsUtil: LogsUtil;
  constructor(reportGeneratedDate: Date = new Date()) {
    this._reportGeneratedDate = reportGeneratedDate;
    // task_list-Sheet1  task_list
    this.excelUtil = new ExcelUtil('task_list');
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
      console.log(projectSummary);
      console.log(individualSummary);
      // console.log('Summary - overall');
      // console.log('totalTasks', summaryTask.totalTasks);
      // console.log('openTasksCount', summaryTask.openTasksCount);
      // console.log(
      //   'inProgressStatusTasksCount',
      //   summaryTask.inProgressStatusTasksCount
      // );
      // console.log('onReviewTasksCount', summaryTask.onReviewTasksCount);
      // console.log('onCloseTasksCount', summaryTask.onCloseTasksCount);
      // console.log('totalTasks', summaryTask.totalTasks);
      // console.log('tasksCompletedCount', summaryTask.tasksCompletedCount);
      // console.log(
      //   'tasksCompletedOnTimeCount',
      //   summaryTask.tasksCompletedOnTimeCount
      // );
      // console.log('tasksTimelinessRate', summaryTask.tasksTimelinessRate);
      // console.log('tasksCompletenesRate', summaryTask.tasksCompletenesRate);

      // // per projects list
      // console.log('`\nSummary per project list');
      // const tasksByProjectList = summaryTask.tasksByProject;
      // for (const project of _.keys(tasksByProjectList).sort()) {
      //   console.log(`\n\nSummary for project ${project}`);
      //   const assigneeTask = new ClickUpReportUtil(tasksByProjectList[project]);
      //   console.log('totalTasks', assigneeTask.totalTasks);
      //   console.log('openTasksCount', assigneeTask.openTasksCount);
      //   console.log(
      //     'inProgressStatusTasksCount',
      //     assigneeTask.inProgressStatusTasksCount
      //   );
      //   console.log('onReviewTasksCount', assigneeTask.onReviewTasksCount);
      //   console.log('onCloseTasksCount', assigneeTask.onCloseTasksCount);
      //   console.log('totalTasks', assigneeTask.totalTasks);
      //   console.log('tasksCompletedCount', assigneeTask.tasksCompletedCount);
      //   console.log(
      //     'tasksCompletedOnTimeCount',
      //     assigneeTask.tasksCompletedOnTimeCount
      //   );
      //   console.log('tasksTimelinessRate', assigneeTask.tasksTimelinessRate);
      //   console.log('tasksCompletenesRate', assigneeTask.tasksCompletenesRate);
      // }
      // const tasksByAssignee = _.groupBy(this._tasks, assigneeColumn);
      // for (const assignee of _.keys(tasksByAssignee).sort()) {
      //   console.log(`\n\nSummary for assignee ${assignee}`);
      //   const assigneeTask = new ClickUpReportUtil(tasksByAssignee[assignee]);
      //   console.log('totalTasks', assigneeTask.totalTasks);
      //   console.log('openTasksCount', assigneeTask.openTasksCount);
      //   console.log(
      //     'inProgressStatusTasksCount',
      //     assigneeTask.inProgressStatusTasksCount
      //   );
      //   console.log('onReviewTasksCount', assigneeTask.onReviewTasksCount);
      //   console.log('onCloseTasksCount', assigneeTask.onCloseTasksCount);
      //   console.log('totalTasks', assigneeTask.totalTasks);
      //   console.log('tasksCompletedCount', assigneeTask.tasksCompletedCount);
      //   console.log(
      //     'tasksCompletedOnTimeCount',
      //     assigneeTask.tasksCompletedOnTimeCount
      //   );
      //   console.log('tasksTimelinessRate', assigneeTask.tasksTimelinessRate);
      //   console.log('tasksCompletenesRate', assigneeTask.tasksCompletenesRate);
      // }
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
        { item1: 'Overall Distribution by Project list' },
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
    } catch (error) {}
    return summaryJson;
  }

  overallTaskByProjectSummary(): any {
    const summaryJson: any[] = [];
    try {
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
