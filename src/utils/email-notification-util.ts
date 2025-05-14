import nodemailer from 'nodemailer';
import { LogsUtil } from '.';
import { emailConfig } from '../configs';
import { flattenDeep, map } from 'lodash';

export class EmailNotificationUtil {
  private _transporter: any;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'login',
        user: emailConfig.senderEmail || '',
        pass: emailConfig.password || ''
      }
    });
  }

  async sendEmail(
    subject: string,
    receiverEmails: string[],
    htmlMessage: string,
    fileNames: string[],
    fileDir: string = ''
  ) {
    try {
      await this._transporter.sendMail({
        from: `${emailConfig.senderName} ${emailConfig.senderEmail}`,
        to: receiverEmails.join(', '),
        subject: subject,
        html: htmlMessage,
        attachments:
          fileNames.length > 0
            ? flattenDeep(
                map(fileNames, (fileName) => {
                  return {
                    filename: fileName,
                    path: fileDir !== '' ? `${fileDir}/${fileName}` : fileName
                  };
                })
              )
            : []
      });
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'sendEmail'
      );
    }
  }
}
