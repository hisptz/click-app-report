import _, { parseInt } from 'lodash';
import { completedDateColum } from '../constants/click-up-excel-file-constant';
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
        const completedDateCustomFieldObj = _.find(
          taskObj.custom_fields || [],
          (customField) => {
            return (
              customField &&
              customField.name &&
              completedDateColum.toLowerCase() ===
                `${customField.name}`.toLowerCase()
            );
          }
        );
        for (const user of taskObj.assignees || []) {
          projectTasks.push({
            id: `${taskObj.id || ''}`,
            name: `${taskObj.name || ''}`,
            description: `${taskObj.description || ''}`,
            status: statusObj.status || ``,
            createdDate: taskObj.date_created
              ? AppUtil.getFormattedDate(parseInt(taskObj.date_created, 10))
              : '',
            dueDate: taskObj.due_date
              ? AppUtil.getFormattedDate(parseInt(taskObj.due_date, 10))
              : taskObj.date_created
              ? AppUtil.getFormattedDate(parseInt(taskObj.date_created, 10))
              : '',
            lastUpdatedDate: taskObj.date_updated
              ? AppUtil.getFormattedDate(parseInt(taskObj.date_updated, 10))
              : null,
            startDate: taskObj.start_date
              ? AppUtil.getFormattedDate(parseInt(taskObj.start_date, 10))
              : null,
            closedDate: taskObj.date_closed
              ? AppUtil.getFormattedDate(parseInt(taskObj.date_closed, 10))
              : null,
            completedDate:
              completedDateCustomFieldObj && completedDateCustomFieldObj.value
                ? AppUtil.getFormattedDate(
                    parseInt(completedDateCustomFieldObj.value, 10)
                  )
                : null,
            timeSpent: AppUtil.getNumberOfHoursSpent(
              parseInt(taskObj.time_spent || '0', 10)
            ),
            list: listObj.name || ``,
            assignee: {
              id: user.id || '',
              username: user.username || '',
              email: user.email || ''
            },
            project: projectObj.name || ``,
            folder: folderObj.name || ``
          });
        }
      }
    } catch (error: any) {
      await this.logsUtil.addLogs(
        'error',
        error.message || error,
        'getProjectTasks'
      );
    }
    return _.flattenDeep(projectTasks);
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
