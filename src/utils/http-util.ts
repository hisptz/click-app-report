import request from 'request';

export class HttpUtil {
  static async getHttp(headers: any, url: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          headers,
          uri: url,
          method: 'GET'
        },
        (error, response, body) => {
          if (!error) {
            let data = null;
            try {
              data = JSON.parse(body);
            } catch (error: any) {
              console.log(error.message || error);
            } finally {
              resolve(data);
            }
          } else {
            reject(error);
          }
        }
      );
    });
  }
}
