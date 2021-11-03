import _ from 'lodash';
import {
  allowedNumberOnReviewTasks,
  closedStatus,
  completedDateColum,
  dateClosedColumn,
  dueDateColumn,
  inProgressStatus,
  lastUpdatedDateColumn,
  openStatus,
  reviewStatus,
  statusColumn,
  taskClosedStatus,
  taskListColum,
  assigneeColumn
} from '../constants/click-up-excel-file-constant';

export class ClickUpReportUtil {
  private _tasks: any[];

  constructor(tasks: any[]) {
    this._tasks = tasks;
  }

  get sortedTasks(): any {
    return _.sortBy(this._tasks, [assigneeColumn, taskListColum]);
  }

  get tasksByAssignee(): any {
    return _.groupBy(this._tasks, assigneeColumn);
  }

  get tasksByProject(): any {
    return _.groupBy(this._tasks, taskListColum);
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
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task: any) => {
        const status = task[statusColumn] || '';
        return status === openStatus;
      }).length;
    } catch (error) {}
    return count;
  }

  get inProgressStatusTasksCount(): number {
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task: any) => {
        const status = task[statusColumn] || '';
        return status === inProgressStatus;
      }).length;
    } catch (error) {}
    return count;
  }

  get onReviewTasksCount(): number {
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task: any) => {
        const status = task[statusColumn] || '';
        return status === reviewStatus;
      }).length;
    } catch (error) {}
    return count;
  }

  get onCloseTasksCount(): number {
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task: any) => {
        const status = task[statusColumn] || '';
        return status === closedStatus;
      }).length;
    } catch (error) {}
    return count;
  }

  get tasksCompletedCount(): number {
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task: any) => {
        const status = task[statusColumn] || '';
        return taskClosedStatus.includes(status);
      }).length;
    } catch (error) {}
    return count;
  }

  get tasksCompletedOnTimeCount(): number {
    let count = 0;
    try {
      count = _.filter(this._tasks || [], (task: any) => {
        const status = task[statusColumn] || '';
        let completedOnTime = false;
        if (taskClosedStatus.includes(status)) {
          const dueDate = task[dueDateColumn];
          const lastUpdateDate = task[lastUpdatedDateColumn];
          const closedDate = task[dateClosedColumn];
          const completedDate = task[completedDateColum];
          if (completedDate) {
            completedOnTime = new Date(dueDate) >= new Date(completedDate);
          } else if (status === reviewStatus && lastUpdateDate) {
            completedOnTime = new Date(dueDate) >= new Date(lastUpdateDate);
          } else if (closedDate) {
            const date = new Date(closedDate);
            completedOnTime =
              new Date(dueDate) >=
              new Date(
                date.setDate(date.getDate() - allowedNumberOnReviewTasks)
              );
          }
        }
        return completedOnTime;
      }).length;
    } catch (error) {}
    return count;
  }

  get totalTasks(): number {
    return this._tasks.length;
  }
}
