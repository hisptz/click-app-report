import { LogsUtil } from "./logs-util";
import * as _ from "lodash";
import xlsx from "xlsx";
import { FileUtil } from "./file-util";

export class ExcelUtil {
  private logsUtil: LogsUtil;
  private fileUtil: FileUtil;
  private defaultSheet: string = "Sheet";
  private excelDir: string = "excels";
  private excelFileName: string;

  constructor(excelFileName: string) {
    this.excelFileName = excelFileName;
    this.logsUtil = new LogsUtil();
    this.fileUtil = new FileUtil(this.excelDir, this.excelFileName, "xlsx");
  }

  async getJsonDataFromExcelOrCsvFile() {
    let data: any = {};
    try {
      const workbook = xlsx.readFile(`${this.fileUtil.filePath}`);
      const sheet_name_list = workbook.SheetNames;
      for (const sheet_name of sheet_name_list) {
        try {
          const sheet = workbook.Sheets[sheet_name];
          const dataObjects = xlsx.utils.sheet_to_json(sheet);
          data[`${sheet_name}`.trim()] = _.map(dataObjects, (dataObj: any) => {
            const newDataObj: any = {};
            for (const key of _.keys(dataObj)) {
              const newKey = `${key}`.trim().replace(/\n/g, "");
              const value = `${dataObj[key]}`.trim();
              if (value != "") {
                newDataObj[newKey] = value;
              }
            }
            return newDataObj;
          });
        } catch (error: any) {
          await this.logsUtil.addLogs(
            "error",
            error.message || error,
            "getJsonDataFromExcelOrCsvFile"
          );
        }
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        "error",
        error.message || error,
        "getJsonDataFromExcelOrCsvFile"
      );
    }
    return data;
  }
}
