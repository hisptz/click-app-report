import shelljs from "shelljs";

export class FileUtil{
    fileDir : string;
    constructor(outputDir : string){
        this.fileDir = `${outputDir}`;
        this.intiateFilesDirectories(this.fileDir);
    }

    intiateFilesDirectories(directories :any) {
        return new Promise((resolve, reject) => {
          const response = shelljs.mkdir("-p", directories);
          if (response && !response.stderr) {
            resolve([]);
          } else {
            reject(response.stderr);
          }
        });
      }
}