import _ from 'lodash';
import { LogsUtil } from '../utils';

export class AppProcess {
  constructor() {}

  async startAppProcess() {
    await new LogsUtil().addLogs('info', 'Start of an app process', 'app');
    /// process for scripts
    await new LogsUtil().addLogs('info', 'End of an app process', 'app');
  }
}
