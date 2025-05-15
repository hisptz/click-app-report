import { map } from 'lodash';
import {
  ADMIN_REPORT_TYPE,
  EXCEL_FOLDER,
  REPORTS_SUB_FOLDER,
  TIMESHEET_REPORT_TYPE,
  TIMESHEETS_SUB_FOLDER
} from '../constants';
import { AppUtil, FileUtil, LogsUtil, UserUtil } from '../utils';
import { EmailNotificationUtil } from '../utils/email-notification-util';
import moment from 'moment';
import { emailConfig } from '../configs';

export class EmailProcess {
  constructor() {}

  async startEmailProcess() {
    const { reportType } = AppUtil.getStartEndDateLimit();
    switch (reportType) {
      case TIMESHEET_REPORT_TYPE: {
        await this._sendMonthlyTimesheets();
        break;
      }
      case ADMIN_REPORT_TYPE: {
        await this._sendAdminMonthlyReports();
        break;
      }
    }
  }

  private async _sendMonthlyTimesheets() {
    await new LogsUtil().addLogs(
      'info',
      `Sending Monthly Timesheets`,
      '_sendMonthlyTimesheets'
    );
    const users = await new UserUtil().getProjectTeamMembers();
    const receiverEmails = map(users, (user) => user.email ?? '');
    const subject = `[${moment().format(
      'MMMM YYYY'
    )}] Monthly Timesheets from ClickUp System`;
    const htmlMessage = `
    <p>Dear Team,</p>
    <p>Hope you are doing well, attached files are the generated timesheets from click up system for <b>${moment().format(
      'MMMM YYYY'
    )}</b> as <i>${moment().format('MMMM Do YYYY, h:mm:ss a')}</i>.</p>
    <p>Best Regards,</p>
    `;
    const fileNames = this._getFileNames(
      `${EXCEL_FOLDER}/${TIMESHEETS_SUB_FOLDER}`
    );
    const fileDir = this._getFullDirName(
      `${EXCEL_FOLDER}/${TIMESHEETS_SUB_FOLDER}`
    );
    await new EmailNotificationUtil().sendEmail(
      subject,
      receiverEmails,
      htmlMessage,
      fileNames,
      fileDir
    );
  }

  private async _sendAdminMonthlyReports() {
    await new LogsUtil().addLogs(
      'info',
      `Sending Admin Monthly Reports`,
      '_sendAdminMonthlyReports'
    );
    const subject = `[${moment().format(
      'MMMM YYYY'
    )}] Staff Time Tracking Summary Report from ClickUp System`;
    const htmlMessage = `
    <p>Dear Team,</p>
    <p>Hope you are doing well, attached files are the summary report for each staff member's time spent and raw files extracted from Click Up the System for reference in <b>${moment().format(
      'MMMM YYYY'
    )}</b> as <i>${moment().format('MMMM Do YYYY, h:mm:ss a')}</i>.</p>
    <p>Best Regards,</p>
    `;
    const fileNames = this._getFileNames(
      `${EXCEL_FOLDER}/${REPORTS_SUB_FOLDER}`
    );
    const fileDir = this._getFullDirName(
      `${EXCEL_FOLDER}/${REPORTS_SUB_FOLDER}`
    );
    await new EmailNotificationUtil().sendEmail(
      subject,
      emailConfig.adminEmails,
      htmlMessage,
      fileNames,
      fileDir
    );
  }

  private _getFullDirName(dir: string): string {
    return new FileUtil(dir, '').fileDir;
  }

  private _getFileNames(dir: string): string[] {
    const fileDir = new FileUtil(dir, '').fileDir;
    return new FileUtil(dir, '').getFilesNamesUsingPath(fileDir);
  }
}
