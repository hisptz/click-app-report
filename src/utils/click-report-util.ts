import _ from 'lodash';

export class ClickUpReportUtil {
  private _task: any[];

  constructor(tasks: any[]) {
    this._task = tasks;
  }

  get tasksCompletenesRate(): string {
    let count = 1.4;
    //@TODO impplement count
    return count.toFixed(2);
  }

  get tasksTimelinessRate(): string {
    let count = 1.4;
    //@TODO impplement count
    return count.toFixed(2);
  }

  get notStartedTasksCount(): number {
    let count = 0;
    //@TODO impplement count
    return count;
  }

  get onProgressTasksCount(): number {
    let count = 0;
    //@TODO impplement count
    return count;
  }

  get onReviewTasksCount(): number {
    let count = 0;
    //@TODO impplement count
    return count;
  }

  get onCloseTasksCount(): number {
    let count = 0;
    //@TODO impplement count
    return count;
  }

  get tasksCompletedOnTimeCount(): number {
    let count = 0;
    //@TODO impplement count
    return count;
  }

  get totalTasks(): number {
    return this._task.length;
  }
}
