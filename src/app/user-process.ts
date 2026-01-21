import { ApiProjectUserModel } from '../models';
import { LogsUtil, UserUtil } from '../utils';

export class UserProcess {
  constructor() {}

  async startUserProcess(): Promise<Array<ApiProjectUserModel>> {
    let users: Array<ApiProjectUserModel> = [];
    const userUtil = new UserUtil();
    try {
      users = await userUtil.getProjectTeamMembers();
      await userUtil.getProjectTeamMembers();
      await userUtil.generateProjectTeamMembersReport(users);
    } catch (error) {
      await new LogsUtil().addLogs(
        'error',
        `Error in User Process: ${error}`,
        'startUserProcess'
      );
    }
    return users;
  }
}
