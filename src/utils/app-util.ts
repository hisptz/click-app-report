import moment from 'moment';

export class AppUtil {
  static getNumberOfHoursSpent(milliseconds: number) {
    return (milliseconds / (1000 * 60 * 60)).toFixed(1);
  }

  static getStartEndDateLimit() {
    const today = this.getFormattedDate(new Date());
    const lastSevenDay = this.getFormattedDate(
      new Date(new Date().setDate(new Date().getDate() - 7))
    );
    let fromDueDateLimit = new Date(lastSevenDay).getTime();
    let toDueDateLimit = new Date(today).getTime();
    try {
      const parameters = process.argv;
      const fromIndex = 2;
      const toIndex = 3;
      if (parameters[fromIndex] && parameters[toIndex]) {
        fromDueDateLimit =
          new Date(parameters[fromIndex]) <= new Date(parameters[toIndex])
            ? new Date(parameters[fromIndex]).getTime()
            : new Date(parameters[toIndex]).getTime();
        toDueDateLimit =
          new Date(parameters[fromIndex]) <= new Date(parameters[toIndex])
            ? new Date(parameters[toIndex]).getTime()
            : new Date(parameters[fromIndex]).getTime();
      } else if (parameters[fromIndex]) {
        fromDueDateLimit =
          new Date(parameters[fromIndex]) <= new Date()
            ? new Date(parameters[fromIndex]).getTime()
            : toDueDateLimit;
        toDueDateLimit =
          new Date(parameters[fromIndex]) <= new Date()
            ? toDueDateLimit
            : new Date(parameters[fromIndex]).getTime();
      }
    } catch (error) {}
    return { fromDueDateLimit, toDueDateLimit };
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

  static getTimeSheetDate(date: any): string {
    let dateObject = new Date(date);
    if (isNaN(dateObject.getDate())) {
      dateObject = new Date();
    }
    return moment(dateObject).format('D MMMM YYYY');
  }
}
