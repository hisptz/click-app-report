import _ from 'lodash';
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

  async setAllTask() {
    try {
      const tasksObject = await this.excelUtil.getJsonDataFromExcelOrCsvFile();
      this._tasks = _.flattenDeep(
        _.map(_.keys(tasksObject || {}), (key) => {
          return _.map(tasksObject[key] || [], (tasks) => {
            console.log(tasks);
            return tasks;
          });
        })
      );
      //console.log(this._tasks);
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'setAllTask'
      );
    }
  }
}
