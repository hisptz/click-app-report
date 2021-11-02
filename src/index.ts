import { LogsUtil } from "./utils/logs-util";

starApp();

async function starApp() {
  try {
    const logsUtil = new LogsUtil();
    await logsUtil.clearLogs();
    await logsUtil.addLogs("info", "start an app", "app");
    // @TODO adding logics for the app script

    await logsUtil.addLogs("info", "End of script", "app");
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
}
