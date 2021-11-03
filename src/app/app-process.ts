import _ from 'lodash';
import { DATE_FIELD_COLUMS } from '../constants/click-up-excel-file-constant';
import { AppUtil } from '../utils/app-util';
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
    this.excelUtil = new ExcelUtil('task_list-Sheet1');
    this.logsUtil = new LogsUtil();
    console.log({ reportGeneratedDate });
  }

  get reportGeneratedDate(): Date {
    return new Date(this._reportGeneratedDate);
  }

  async generateTaskSummary() {
    try {
      // get overall summary
      // Overall
      // per projects
      // getting summary per individual
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setAllTask'
      );
    }
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
        _.map(_.keys(tasksObject || {}), (key) => {
          return _.map(tasksObject[key] || [], (task: any) => {
            const formattedTask: any = {};
            for (const colum of _.keys(task)) {
              let value = task[colum];
              if (DATE_FIELD_COLUMS.indexOf(colum) > -1) {
                const reportGeneratedDate = this.reportGeneratedDate;
                value = AppUtil.getTaskDate(value, reportGeneratedDate);
              }
              formattedTask[colum] = value;
            }
            return formattedTask;
          });
        })
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
