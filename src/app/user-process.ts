import { ApiProjectUserModel } from '../models';
import { UserUtil } from '../utils';

export class UserProcess {
  constructor() {}

  async startUserProcess() {
    const userUtil = new UserUtil();
    const users: Array<ApiProjectUserModel> =
      await userUtil.getProjectTeamMembers();
    await userUtil.generateProjectTeamMembersReport(users);
  }
}
