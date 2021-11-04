import _ from 'lodash';
import { ApiConfigModel } from '../models/api-config-model';
import { ApiProjectFolderModel } from '../models/api-project-folder-model';
import { ApiProjectUserModel } from '../models/api-project-user-model';
import { HttpUtil } from './http-util';
import { LogsUtil } from './logs-util';

export class ApiUtil {
  private _baseUrl: string;
  private _teamId: string;
  private _headers: any;

  private logsUtil: LogsUtil;

  constructor(apiConfig: ApiConfigModel) {
    this._baseUrl = apiConfig.appBaseUrl;
    this._teamId = apiConfig.teamId;
    this._headers = {
      'Content-Type': 'application/json',
      Authorization: apiConfig.authorizationKey
    };
    this.logsUtil = new LogsUtil();
  }

  async getProjectUsers(): Promise<Array<ApiProjectUserModel>> {
    const users: Array<ApiProjectUserModel> = [];
    try {
      const url = `${this._baseUrl}/team/${this._teamId}`;
      const response: any = await HttpUtil.getHttp(this._headers, url);
      const team = response.team || {};
      for (const member of team.members || []) {
        const user = member.user || {};
        users.push({
          id: user.id || '',
          username: user.username || '',
          email: user.email || ''
        });
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'getProjectUsers'
      );
    }
    return _.sortBy(users, ['username']);
  }

  async getProjectFolderList(): Promise<Array<ApiProjectFolderModel>> {
    const folderList: Array<ApiProjectFolderModel> = [];
    await this.logsUtil.addLogs(
      'info',
      `Discovering project folder list`,
      'getProjectFolderList'
    );
    try {
      const url = `${this._baseUrl}/team/${this._teamId}/folder`;
      const response: any = await HttpUtil.getHttp(this._headers, url);
      for (const folder of response.folders || []) {
        const projectList = this.getProjectListDetail(folder);
        folderList.push(projectList);
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'getProjectFolderList'
      );
    }
    return folderList;
  }

  private getProjectListDetail(projectList: any): ApiProjectFolderModel {
    const statuses = [];
    const lists: Array<ApiProjectFolderModel> = [];
    for (const listObj of projectList.lists || []) {
      const projectList = this.getProjectListDetail(listObj);
      lists.push(projectList);
    }
    for (const statusObj of projectList.statuses || []) {
      statuses.push({
        id: `${statusObj.id || ''}`,
        status: `${statusObj.status || ''}`,
        color: `${statusObj.color || ''}`
      });
    }
    return {
      id: `${projectList.id || ''}`,
      name: `${projectList.name || ''}`,
      statuses: _.flattenDeep(statuses),
      lists: _.flattenDeep(lists)
    };
  }

  get config(): any {
    return {
      url: this._baseUrl,
      headers: this._headers
    };
  }
}
