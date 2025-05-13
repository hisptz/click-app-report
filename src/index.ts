import { LogsUtil, AppUtil } from './utils';
import { AppProcess } from './app';

starApp();

async function starApp() {
  const logsUtil = new LogsUtil();
  await logsUtil.clearLogs();
  await logsUtil.addLogs('info', 'start an app', 'app');
  try {
    const appProcess = new AppProcess();
    await appProcess.startAppProcess();
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
  await logsUtil.addLogs('info', 'End of script', 'app');
}
