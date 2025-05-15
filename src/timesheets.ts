import shelljs from 'shelljs';
import { MINIMUM_WORKING_DAYS, TIMESHEET_REPORT_TYPE } from './constants';

starApp();

async function starApp() {
  //TODO dynamic dates
  const startDate = '2025-05-01';
  const endDate = '2025-05-31';
  const command = `./run-script.sh ${startDate} ${endDate} ${MINIMUM_WORKING_DAYS} ${TIMESHEET_REPORT_TYPE}`;
  shelljs.exec(command, (code, stdout, stderr) => {
    if (code !== 0) {
      console.log(`Error: ${stderr}`);
    } else {
      console.log(`Output: ${stdout}`);
    }
  });
}
