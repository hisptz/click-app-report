import { filter, first, flattenDeep, map, sortBy } from 'lodash';
import { ExcelUtil, HttpUtil, LogsUtil } from '.';
import { ApiProjectFolderModel } from '../models';
import { apiConfig } from '../configs';
import { ADMIN_SUB_FOLDER } from '../constants';

export class ProjectUtil {
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

  async getProjectFolderList(): Promise<Array<ApiProjectFolderModel>> {
    const projectFolderList: Array<ApiProjectFolderModel> = [];
    await new LogsUtil().addLogs(
      'info',
      `Discovering project folder list`,
      'getProjectFolderList'
    );
    try {
      const url = `${this._baseUrl}/team/${this._teamId}/folder`;
      const response: any = await HttpUtil.getHttp(this._headers, url);
      for (const folder of response.folders || []) {
        const projectList = this._getProjectListDetail(folder);
        projectFolderList.push(projectList);
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getProjectFolderList'
      );
    }
    return sortBy(projectFolderList, 'name');
  }

  _getProjectListDetail(projectList: any): ApiProjectFolderModel {
    const statuses = [];
    const lists: Array<ApiProjectFolderModel> = [];
    for (const listObj of projectList.lists || []) {
      const projectList = this._getProjectListDetail(listObj);
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
      statuses: flattenDeep(statuses),
      lists: sortBy(flattenDeep(lists), 'name')
    };
  }

  async generateProjectFolderListReport(
    projectFolderList: Array<ApiProjectFolderModel>
  ) {
    try {
      await new LogsUtil().addLogs(
        'info',
        'Generating project folder list structure',
        'generateProjectFolderListReport'
      );
      const jsonData = flattenDeep(
        map(projectFolderList, (projectFolder: ApiProjectFolderModel) => {
          const firstActivity = first(projectFolder.lists);
          return [
            { Project: projectFolder.name, Activity: firstActivity?.name },
            ...map(
              filter(
                projectFolder.lists || [],
                (list: ApiProjectFolderModel) => list.id !== firstActivity?.id
              ),
              (subProjectFolder: ApiProjectFolderModel) => {
                return { Project: '', Activity: subProjectFolder.name };
              }
            )
          ];
        })
      );
      await new ExcelUtil(
        'project folder list',
        ADMIN_SUB_FOLDER
      ).writeToSingleSheetExcelFile(jsonData, false, 'Project');
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'generateProjectFolderListReport'
      );
    }
  }
}
