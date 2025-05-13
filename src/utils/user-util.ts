import { sortBy } from 'lodash';
import { ExcelUtil, HttpUtil, LogsUtil } from '.';
import { apiConfig } from '../configs';
import { ApiProjectUserModel } from '../models';
import { ADMIN_SUB_FOLDER } from '../constants';

export class UserUtil {
  private _baseUrl: string;
  private _teamId: string;
  private _headers: any;

  constructor() {
    this._baseUrl = apiConfig.appBaseUrl;
    this._teamId = apiConfig.teamId;
    this._headers = {
      'Content-Type': 'application/json',
      Authorization: apiConfig.authorizationKey
    };
  }

  async getProjectTeamMembers(): Promise<Array<ApiProjectUserModel>> {
    const users: Array<ApiProjectUserModel> = [];
    await new LogsUtil().addLogs(
      'info',
      `Discovering project team members list`,
      'getProjectTeamMembers'
    );
    try {
      const url = `${this._baseUrl}/team/${this._teamId}`;
      const response: any = await HttpUtil.getHttp(this._headers, url);
      const team = response.team || {};
      for (const member of team.members || []) {
        const user = member.user || {};
        console.log(user);
        users.push({
          id: user.id || '',
          username: user.username || '',
          email: user.email || ''
        });
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getProjectTeamMembers'
      );
    }
    return sortBy(users, ['username']);
  }

  async generateProjectTeamMembersReport(users: Array<ApiProjectUserModel>) {
    try {
      await new LogsUtil().addLogs(
        'info',
        'Generating Project Team Memnber list report',
        'generateProjectTeamMembersReport'
      );
      await new ExcelUtil(
        'project team members',
        ADMIN_SUB_FOLDER
      ).writeToSingleSheetExcelFile(users, false, 'User List');
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'generateProjectTeamMembersReport'
      );
    }
  }
}
