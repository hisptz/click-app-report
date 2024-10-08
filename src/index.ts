import { LogsUtil } from './utils/logs-util';
import { AppProcess } from './app/app-process';
import { apiConfig } from './configs/api-config';
import { AppUtil } from './utils/app-util';

starApp();

async function starApp() {
  try {
    const { fromDueDateLimit, toDueDateLimit, workingDays } =
      AppUtil.getStartEndDateLimit();
    const appProcess = new AppProcess(apiConfig, workingDays);
    const logsUtil = new LogsUtil();
    await logsUtil.clearLogs();
    await logsUtil.addLogs('info', 'start an app', 'app');
    await appProcess.setWorkspaceFolders();
    await appProcess.setWorkSpaceUsers();
    await appProcess.generateWorkSpaceFolderReport();
    await appProcess.generateWorkSpaceUserReport();
    await appProcess.setAllTask(fromDueDateLimit, toDueDateLimit);
    await appProcess.generateSourceReportFile();
    await appProcess.generateTaskSummary(fromDueDateLimit, toDueDateLimit);
    await appProcess.generatePayrollForStaff();
    await appProcess.generateTimeSheetForIndividual(
      fromDueDateLimit,
      toDueDateLimit
    );
    await logsUtil.addLogs('info', 'End of script', 'app');
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
}
