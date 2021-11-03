export class AppUtil {
  static getTaskDate(date: any, reportGeneratedDate: Date = new Date()) {
    let taskDate = '';
    try {
      if (typeof date == 'string' && date.includes('/')) {
        const dateArray = date.split('/');
        if (dateArray.length > 2) {
          const year = new Date().getFullYear();
          const month = parseInt(dateArray[1], 10);
          const day = parseInt(dateArray[0], 10);
          const newDate =
            year +
            (month > 9 ? `-${month}` : `-0${month}`) +
            (day > 9 ? `-${day}` : `-0${day}`);
          taskDate = this.getFormattedDate(newDate);
        }
      } else if (typeof date == 'string' && date.includes('days ago')) {
        const numberOfdays = parseInt(date.split(' ')[0] ?? '0', 10);
        taskDate = this.getFormattedDate(
          new Date(
            reportGeneratedDate.setDate(
              reportGeneratedDate.getDate() - numberOfdays
            )
          )
        );
      } else if (!isNaN(new Date(date).getDate())) {
        taskDate = this.getFormattedDate(date);
      } else {
        taskDate = this.getExcelDateToJSDate(date);
      }
    } catch (error) {}
    console.log({ taskDate, date, reportGeneratedDate });
    return taskDate;
  }

  static getExcelDateToJSDate(date: any) {
    return this.getFormattedDate(
      new Date(Math.round((date - 25569) * 86400 * 1000))
    );
  }

  static getFormattedDate(date: any) {
    let dateObject = new Date(date);
    if (isNaN(dateObject.getDate())) {
      dateObject = new Date();
    }
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return (
      year +
      (month > 9 ? `-${month}` : `-0${month}`) +
      (day > 9 ? `-${day}` : `-0${day}`)
    );
  }
}