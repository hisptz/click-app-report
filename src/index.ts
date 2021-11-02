import { ExcelUtil } from "./utils/excel-util";
import { LogsUtil } from "./utils/logs-util";

import * as _ from "lodash";

starApp();

async function starApp() {
  try {
    const logsUtil = new LogsUtil();
    await logsUtil.clearLogs();
    await logsUtil.addLogs("info", "start an app", "app");
    // @TODO adding logics for the app script
    const excelUtil = new ExcelUtil("task_list");
    const data = await excelUtil.getJsonDataFromExcelOrCsvFile();
    for(var key of _.keys(data)){
      await new ExcelUtil(
        `task_list-${key}`
      ).writeToSingleSheetExcelFile(_.chunk(data[key], 10)[0]);
    }
    await new ExcelUtil(
      "task_list-new"
    ).writeToMultipleSheetExcelFile(data);

    await logsUtil.addLogs("info", "End of script", "app");
  } catch (error: any) {
    error = error.message || error;
    console.log({ error });
  }
}
