import _ from 'lodash';
import { AppUtil, LogsUtil } from '../utils';
import { ProjectProcess, TaskProcess, UserProcess, EmailProcess } from '.';

export class AppProcess {
  constructor() {}

  async startAppProcess() {
    const { reportType } = AppUtil.getStartEndDateLimit();
    await new LogsUtil().addLogs('info', 'Start of an app process', 'app');
    await new ProjectProcess().startProjectProcess();
    await new UserProcess().startUserProcess();
    await new TaskProcess().startTaskProcess();
    if (reportType !== '') {
      await new EmailProcess().startEmailProcess();
    }

    await new LogsUtil().addLogs('info', 'End of an app process', 'app');
  }
}
