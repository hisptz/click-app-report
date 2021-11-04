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
  taskClosedStatus
} from '../constants/click-up-excel-file-constant';
import { ApiProjectTaskModel } from '../models/api-project-task-model';

export class ClickUpReportUtil {
  private _tasks: Array<ApiProjectTaskModel>;

  constructor(tasks: Array<ApiProjectTaskModel> = []) {
    this._tasks = tasks;
  }

  get sortedTasks(): any {
    return _.sortBy(
      _.sortBy(this._tasks, (task) => task.assignee.username || ''),
      ['list']
    );
  }

  get tasksByAssignee(): any {
    return _.groupBy(this._tasks, (task) => task.assignee.username || '');
  }

  get tasksByProject(): any {
    return _.groupBy(this._tasks, (task) => task.list);
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
    return _.filter(this._tasks || [], (task) => task.status === openStatus)
      .length;
  }

  get inProgressStatusTasksCount(): number {
    return _.filter(
      this._tasks || [],
      (task) => task.status === inProgressStatus
    ).length;
  }

  get onReviewTasksCount(): number {
    return _.filter(this._tasks || [], (task) => task.status === reviewStatus)
      .length;
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
    return _.filter(this._tasks || [], (task) =>
      taskClosedStatus.includes(task.status)
    ).length;
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
