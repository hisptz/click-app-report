import { LogsUtil, AppUtil } from './utils';

starApp();

async function starApp() {
  const logsUtil = new LogsUtil();
  await logsUtil.clearLogs();
  await logsUtil.addLogs('info', 'start an app', 'app');
  try {
    const { fromDueDateLimit, toDueDateLimit, workingDays } =
      AppUtil.getStartEndDateLimit();
    console.log({
      fromDueDateLimit,
      toDueDateLimit,
      workingDays,
      fromDate: AppUtil.getFormattedDate(fromDueDateLimit),
      toDate: AppUtil.getFormattedDate(toDueDateLimit)
    });
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
  await logsUtil.addLogs('info', 'End of script', 'app');
}
