import { ExcelUtil } from './utils/excel-util';
import { LogsUtil } from './utils/logs-util';

import * as _ from 'lodash';
import { AppProcess } from './app/app-process';

starApp();

async function starApp() {
  try {
    const reportGeneratedDate = new Date('2021-11-01');
    const appProcess = new AppProcess(reportGeneratedDate);
    const logsUtil = new LogsUtil();
    await logsUtil.clearLogs();
    await logsUtil.addLogs('info', 'start an app', 'app');
    await appProcess.setAllTask();
    await logsUtil.addLogs('info', 'End of script', 'app');
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
}
