import _ from 'lodash';
import { LogsUtil } from '../utils';
import { ProjectProcess } from '.';

export class AppProcess {
  constructor() {}

  async startAppProcess() {
    await new LogsUtil().addLogs('info', 'Start of an app process', 'app');
    await new ProjectProcess().startProjectProcess();

    await new LogsUtil().addLogs('info', 'End of an app process', 'app');
  }
}
