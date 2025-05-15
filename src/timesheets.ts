import shelljs from 'shelljs';
import { MINIMUM_WORKING_DAYS, TIMESHEET_REPORT_TYPE } from './constants';

starApp();

async function starApp() {
  const dayOfTimesheet = 22;
  const monthIndex = new Date().getMonth();
  const startDate = new Date(new Date().setDate(dayOfTimesheet));
  const endDate = new Date(
    new Date(new Date().setMonth(monthIndex, 0)).setDate(dayOfTimesheet)
  );
  const command = `./run-script.sh ${startDate} ${endDate} ${MINIMUM_WORKING_DAYS} ${TIMESHEET_REPORT_TYPE}`;
  shelljs.exec(command, (code, stdout, stderr) => {
    if (code !== 0) {
      console.log(`Error: ${stderr}`);
    } else {
      console.log(`Output: ${stdout}`);
    }
  });
}
