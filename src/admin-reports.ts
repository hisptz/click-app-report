import shelljs from 'shelljs';
import { ADMIN_REPORT_TYPE, MINIMUM_WORKING_DAYS } from './constants';
import { AppUtil } from './utils';

starApp();

async function starApp() {
  const monthIndex = new Date().getMonth();
  const startDate = AppUtil.getFormattedDate(new Date(new Date().setDate(1)));
  const endDate = AppUtil.getFormattedDate(
    new Date(new Date(new Date().setMonth(monthIndex, 0)).setDate(1))
  );
  const command = `./run-script.sh ${startDate} ${endDate} ${MINIMUM_WORKING_DAYS} ${ADMIN_REPORT_TYPE}`;
  shelljs.exec(command, (code, stdout, stderr) => {
    if (code !== 0) {
      console.log(`Error: ${stderr}`);
    } else {
      console.log(`Output: ${stdout}`);
    }
  });
}
