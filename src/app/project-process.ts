import { ApiProjectFolderModel } from '../models';
import { ProjectUtil } from '../utils';

export class ProjectProcess {
  constructor() {}

  async startProjectProcess() {
    const projectUtil = new ProjectUtil();
    const projectFolderList: Array<ApiProjectFolderModel> =
      await projectUtil.getProjectFolderList();
    await projectUtil.generateProjectFolderListReport(projectFolderList);
  }
}
