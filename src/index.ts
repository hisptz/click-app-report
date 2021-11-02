import { FileUtil } from "./utils/file-util";

starApp();

async function starApp() {
  const fileUtil = new FileUtil("resources/logs", "logs jose");

  fileUtil.writeToFile({ id: "id" }, true);
  const data = await fileUtil.readDataFromFile();
  console.log(data);
}
