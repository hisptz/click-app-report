import { LogsUtil } from './utils/logs-util';
import { AppProcess } from './app/app-process';

starApp();

async function starApp() {
  try {
    const reportGeneratedDate = new Date();
    const inputExcelFile = 'task_list';
    const appProcess = new AppProcess(reportGeneratedDate, inputExcelFile);
    const logsUtil = new LogsUtil();
    await logsUtil.clearLogs();
    await logsUtil.addLogs('info', 'start an app', 'app');
    await appProcess.setAllTask();
    await appProcess.generateTaskSummary();
    await logsUtil.addLogs('info', 'End of script', 'app');
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
}
