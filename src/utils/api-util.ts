import _ from 'lodash';
import { ApiConfigModel } from '../models/api-config-model';
import { ApiProjectFolderModel } from '../models/api-project-folder-model';
import { ApiProjectTaskModel } from '../models/api-project-task-model';
import { ApiProjectUserModel } from '../models/api-project-user-model';
import { AppUtil } from './app-util';
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

  async getProjectTasks(
    fromDueDateLimit: number,
    toDueDateLimit: number
  ): Promise<Array<ApiProjectTaskModel>> {
    const projectTasks: Array<ApiProjectTaskModel> = [];
    await this.logsUtil.addLogs(
      'info',
      `Discovering project folder list's tasks`,
      'getProjectTasks'
    );
    try {
      const url = `${this._baseUrl}/team/${this._teamId}/task?due_date_lt=${toDueDateLimit}&include_closed=true&due_date_gt=${fromDueDateLimit}&reverse=true`;
      const response: any = await HttpUtil.getHttp(this._headers, url);

      for (const taskObj of response.tasks || []) {
        const projectObj = taskObj.project || {};
        const folderObj = taskObj.folder || {};
        const statusObj = taskObj.status || {};
        const listObj = taskObj.list || {};
        const assignees: Array<ApiProjectUserModel> = _.flattenDeep(
          _.map(taskObj.assignees || [], (user) => {
            return {
              id: user.id || '',
              username: user.username || '',
              email: user.email || ''
            };
          })
        );
        projectTasks.push({
          id: `${taskObj.id || ''}`,
          name: `${taskObj.name || ''}`,
          description: `${taskObj.description || ''}`,
          status: statusObj.status || ``,
          createdDate: taskObj.date_created
            ? AppUtil.getFormattedDate(taskObj.date_created)
            : null,
          dueDate: taskObj.due_date
            ? AppUtil.getFormattedDate(taskObj.due_date)
            : null,
          lastUpdatedDate: taskObj.date_updated
            ? AppUtil.getFormattedDate(taskObj.date_updated)
            : null,
          startDate: taskObj.start_date
            ? AppUtil.getFormattedDate(taskObj.start_date)
            : null,
          closedDate: taskObj.date_closed
            ? AppUtil.getFormattedDate(taskObj.date_closed)
            : null,
          completedDate: '',
          list: listObj.name || ``,
          assignees,
          project: projectObj.name || ``,
          folder: folderObj.name || ``
        });
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'getProjectTasks'
      );
    }
    return projectTasks;
  }

  async getProjectUsers(): Promise<Array<ApiProjectUserModel>> {
    const users: Array<ApiProjectUserModel> = [];
    await this.logsUtil.addLogs(
      'info',
      `Discovering project members list`,
      'getProjectUsers'
    );
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
