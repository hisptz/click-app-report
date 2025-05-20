import shelljs from 'shelljs';
import { MINIMUM_WORKING_DAYS, TIMESHEET_REPORT_TYPE } from './constants';
import { AppUtil } from './utils';

starApp();

async function starApp() {
  const dayOfTimesheet = 22;
  const isTodayForReportGeneration =
    AppUtil.isTodayNthDayOfMonth(dayOfTimesheet);
  if (isTodayForReportGeneration) {
    const monthIndex = new Date().getMonth();
    const startDate = AppUtil.getFormattedDate(
      new Date(new Date().setDate(dayOfTimesheet))
    );
    const endDate = AppUtil.getFormattedDate(
      new Date(
        new Date(new Date().setMonth(monthIndex, 0)).setDate(dayOfTimesheet)
      )
    );
    const command = `./run-script.sh ${startDate} ${endDate} ${MINIMUM_WORKING_DAYS} ${TIMESHEET_REPORT_TYPE}`;
    shelljs.exec(command, (code, stdout, stderr) => {
      if (code !== 0) {
        console.log(`Error: ${stderr}`);
      } else {
        console.log(`Output: ${stdout}`);
      }
    });
  } else {
    console.log('Today is not the day for report generation.');
  }
}
