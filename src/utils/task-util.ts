import { find, flattenDeep, keys, uniqBy } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import { apiConfig } from '../configs';
import { CODES_TO_PROJECT_MAPPING, COMPLETED_DATE_COLUMN } from '../constants';
import { ApiProjectTaskModel } from '../models';

export class TaskUtil {
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

  async getAllProjectTasks(): Promise<Array<ApiProjectTaskModel>> {
    let projectTasks: Array<ApiProjectTaskModel> = [];
    try {
      await new LogsUtil().addLogs(
        'info',
        'Retrieving all tasks for report generation',
        'getAllProjectTasks'
      );
      const { fromDueDateLimit, toDueDateLimit } =
        AppUtil.getStartEndDateLimit();
      let continueFetch = true;
      let page = 0;
      while (continueFetch) {
        const tasks: ApiProjectTaskModel[] = await this._getProjectTasks(
          fromDueDateLimit,
          toDueDateLimit,
          page
        );
        if (tasks.length > 0) {
          projectTasks = uniqBy([...projectTasks, ...tasks], 'id');
        }
        continueFetch = tasks.length > 0;
        page++;
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getAllProjectTasks'
      );
    }
    return projectTasks;
  }

  private async _getProjectTasks(
    fromDueDateLimit: number,
    toDueDateLimit: number,
    page: number
  ): Promise<Array<ApiProjectTaskModel>> {
    const projectTasks: Array<ApiProjectTaskModel> = [];
    await new LogsUtil().addLogs(
      'info',
      `Discovering project folder list's tasks :: page ${page + 1}`,
      '_getProjectTasks'
    );
    try {
      const url = `${this._baseUrl}/team/${this._teamId}/task?archived=false&page=${page}&due_date_lt=${toDueDateLimit}&include_closed=true&due_date_gt=${fromDueDateLimit}&reverse=true`;
      const response: any = await HttpUtil.getHttp(this._headers, url);
      await new LogsUtil().addLogs(
        'info',
        `Formatting discovered project folder list's tasks`,
        '_getProjectTasks'
      );
      for (const taskObj of response.tasks || []) {
        const projectObj = taskObj.project || {};
        const folderObj = taskObj.folder || {};
        const statusObj = taskObj.status || {};
        const listObj = taskObj.list || {};
        const completedDateCustomFieldObj = find(
          taskObj.custom_fields || [],
          (customField) => {
            return (
              customField &&
              customField.name &&
              COMPLETED_DATE_COLUMN.toLowerCase() ===
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
            projectCode: this._getProjectCode(projectObj.name || ``),
            project: projectObj.name || ``,
            folder: folderObj.name || ``,
            dueDateFrom: AppUtil.getFormattedDate(fromDueDateLimit),
            dueDateTo: AppUtil.getFormattedDate(toDueDateLimit)
          });
        }
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        '_getProjectTasks'
      );
    }
    return flattenDeep(projectTasks);
  }

  private _getProjectCode(projectCode: string): string {
    for (const code of keys(CODES_TO_PROJECT_MAPPING)) {
      const projectCodes = CODES_TO_PROJECT_MAPPING[code] || [];
      if (projectCodes.includes(projectCode)) {
        projectCode = code;
      }
    }
    return projectCode;
  }
}
