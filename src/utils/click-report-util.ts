import _ from 'lodash';
import {
  ALLOWED_NUMBER_ON_REVIEW_TASKS,
  CLOSED_STATUS,
  IN_PROGRESS_STATUS,
  OPEN_STATUS,
  REVIEW_STATUS,
  TASK_CLOSED_STATUS,
  TOTAL_NUMBER_OF_HOURS_PER_DAY
} from '../constants/click-up-excel-file-constant';
import { ApiProjectTaskModel } from '../models/api-project-task-model';
import { AppUtil } from './app-util';

export class ClickUpReportUtil {
  private _tasks: Array<ApiProjectTaskModel>;
  private _excelJsonConfig: any;

  constructor(
    tasks: Array<ApiProjectTaskModel> = [],
    excelJsonConfig: any = {}
  ) {
    this._excelJsonConfig = excelJsonConfig;
    this._tasks = tasks;
  }

  get sortedTasksByName(): Array<ApiProjectTaskModel> {
    return _.sortBy(this._tasks, (task) => task.assignee.username || '');
  }

  get sortedTasksByDate(): Array<ApiProjectTaskModel> {
    return _.sortBy(this._tasks, (task) => task.dueDate);
  }

  get tasksByAssignee(): any {
    return _.groupBy(this._tasks, (task) => task.assignee.username || '');
  }

  get tasksByProject(): any {
    return _.groupBy(this._tasks, (task) => task.project);
  }

  get tasksCompletenesRate(): string {
    const count = (this.tasksCompletedCount / this.totalTasks) * 100;
    return count.toFixed(2);
  }

  get tasksTimelinessRate(): string {
    const count = (this.tasksCompletedOnTimeCount / this.totalTasks) * 100;
    return count.toFixed(2);
  }

  get openTasksCount(): number {
    return _.filter(this._tasks || [], (task) => task.status === OPEN_STATUS)
      .length;
  }

  get inProgressStatusTaksCount(): number {
    return _.filter(
      this._tasks || [],
      (task) => task.status === IN_PROGRESS_STATUS
    ).length;
  }

  get onReviewTasksCount(): number {
    return _.filter(this._tasks || [], (task) => task.status === REVIEW_STATUS)
      .length;
  }

  get onCloseTasksCount(): number {
    return _.filter(this._tasks || [], (task) => task.status === CLOSED_STATUS)
      .length;
  }

  get tasksCompletedCount(): number {
    return _.filter(this._tasks || [], (task) =>
      TASK_CLOSED_STATUS.includes(task.status)
    ).length;
  }

  get totalHoursSpent(): string {
    return _.sumBy(this._tasks, (task) => parseFloat(task.timeSpent)).toFixed(
      1
    );
  }

  get totalDaysSpent(): string {
    return (
      _.sumBy(this._tasks, (task) => parseFloat(task.timeSpent)) /
      TOTAL_NUMBER_OF_HOURS_PER_DAY
    ).toFixed(1);
  }

  get tasksCompletedOnTimeCount(): number {
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task) => {
        const status = task.status;
        let completedOnTime = false;
        if (TASK_CLOSED_STATUS.includes(status)) {
          const dueDate = task.dueDate || task.createdDate;
          const lastUpdateDate = task.lastUpdatedDate;
          const closedDate = task.closedDate;
          const completedDate = task.completedDate;
          if (completedDate) {
            completedOnTime = new Date(dueDate) >= new Date(completedDate);
          } else if (status === REVIEW_STATUS && lastUpdateDate) {
            completedOnTime = new Date(dueDate) >= new Date(lastUpdateDate);
          } else if (closedDate) {
            const isInRange = AppUtil.isDateInRangeOfDate(
              closedDate,
              task.dueDateFrom,
              task.dueDateTo
            );
            if (isInRange) {
              // Assumming the max is between specific period of report
              const date = new Date(closedDate);
              completedOnTime =
                new Date(dueDate) >=
                new Date(
                  date.setDate(date.getDate() - ALLOWED_NUMBER_ON_REVIEW_TASKS)
                );
            } else {
              //Assume this task was completed before on time
              completedOnTime = true;
            }
          }
        }
        return completedOnTime;
      }).length;
    } catch (error) {}
    return count;
  }

  get toExcelJson(): any {
    return _.flattenDeep(
      _.map(this.sortedTasksByName, (task: ApiProjectTaskModel) => {
        const taskObj: any = {
          ...{},
          ...task,
          assignee: task.assignee.username || ''
        };
        const formttedTaskObj: any = {};
        for (var key of _.keys(this._excelJsonConfig)) {
          const column = this._excelJsonConfig[key];
          if (taskObj[key]) {
            formttedTaskObj[column] = taskObj[key] || '';
          }
        }
        return formttedTaskObj;
      })
    );
  }

  get totalTasks(): number {
    return this._tasks.length;
  }
}
