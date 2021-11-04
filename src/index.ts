import { LogsUtil } from './utils/logs-util';
import { AppProcess } from './app/app-process';
import { apiConfig } from './configs/api-config';

starApp();

async function starApp() {
  try {
    const reportGeneratedDate = new Date();
    const appProcess = new AppProcess(apiConfig, reportGeneratedDate);
    const logsUtil = new LogsUtil();
    await logsUtil.clearLogs();
    await logsUtil.addLogs('info', 'start an app', 'app');
    await appProcess.setAllTask();
    // await appProcess.generateTaskSummary();
    await logsUtil.addLogs('info', 'End of script', 'app');
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
}
