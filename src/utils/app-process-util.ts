import { filter, first, keys } from 'lodash';
import { ApiProjectTaskModel } from '../models';
import { AppUtil, ReportUtil } from '.';
import { TASK_CLOSED_STATUS } from '../constants';

export class AppProcessUtil {
  static getIndividualTimeSheetSummary(
    fromDate: string,
    toDate: string,
    tasksByAssignee: any,
    assignee: string
  ) {
    const summaryJson: any[] = [
      {
        item1: ``
      },
      {
        item1: `P O Box 31775 Dar Es Salaam`
      },
      {
        item1: `Activities Monthly Timesheet from ${fromDate} to ${toDate}`
      },
      {
        item1: `Date`,
        item2: `Section`,
        item3: `Activity Description`,
        item4: `No of Hours`
      }
    ];
    const tasks = filter(
      new ReportUtil(tasksByAssignee[assignee]).sortedTasksByDate,
      (task) =>
        TASK_CLOSED_STATUS.includes(task.status) &&
        parseFloat(task.timeSpent) > 0
    );
    const timeSheetReportUtil = new ReportUtil(tasks);
    for (const task of timeSheetReportUtil.sortedTasksByDate) {
      summaryJson.push({
        item1: AppUtil.getTimeSheetDate(task.dueDate),
        item2: task.projectCode,
        item3: task.name,
        item4: task.timeSpent
      });
    }
    summaryJson.push(
      {
        item1: ``,
        item2: ``,
        item3: `Total Hours`,
        item4: `${timeSheetReportUtil.totalHoursSpent}`
      },
      {
        item1: ``,
        item2: ``,
        item3: `Total Number of Days`,
        item4: `${timeSheetReportUtil.totalDaysSpent}`
      },
      { item1: '' },
      {
        item1: `Submitted By:`,
        item2: `${assignee}`,
        item3: ``,
        item4: ``
      },
      {
        item1: ``,
        item2: ``,
        item3: `I certify that the time reported on this time sheet is accurate and complete to the best of my knowledge`,
        item4: ``
      },
      {
        item1: `Approved By:`,
        item2: ``,
        item3: ``,
        item4: ``
      },
      {
        item1: ``,
        item2: ``,
        item3: `I have reviewed this time sheet and certify that it is accurate and complete to the best of my knowledge`,
        item4: ``
      }
    );
    return summaryJson;
  }

  static dqaSummary(workingDays: number, allTasks: ApiProjectTaskModel[]) {
    const summaryJson = [
      { item1: `Expected working days : ${workingDays}` },
      {},
      { item1: 'Full Name', item2: 'Number of Days spent' }
    ];
    try {
      const reportUtil = new ReportUtil(allTasks);
      const tasksByAssignee = reportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee)) {
        const tasks = filter(
          new ReportUtil(tasksByAssignee[assignee]).sortedTasksByDate,
          (task) =>
            TASK_CLOSED_STATUS.includes(task.status) &&
            parseFloat(task.timeSpent) > 0
        );
        const numberOfWeekEndDays = 2 * parseInt(`${workingDays / 5}`, 10);
        const assigneeReportUtil = new ReportUtil(tasks);
        const totalDaysSpent = parseFloat(assigneeReportUtil.totalDaysSpent);
        const maximunDayOffLimit = parseFloat((workingDays / 8).toFixed(1));
        if (
          totalDaysSpent + maximunDayOffLimit < workingDays ||
          workingDays + numberOfWeekEndDays < totalDaysSpent
        ) {
          summaryJson.push({
            item1: `${assignee}`,
            item2: `${totalDaysSpent}`
          });
        }
      }
    } catch (error) {}
    return summaryJson;
  }

  static overallTaskSummary(
    fromDate: string,
    toDate: string,
    allTasks: ApiProjectTaskModel[]
  ): any {
    const summaryJson: any[] = [
      {
        item1: `Click up report of activities from ${fromDate} to ${toDate}`
      },
      { item1: `` }
    ];
    try {
      const reportUtil = new ReportUtil(allTasks);
      summaryJson.push({
        item1: 'Overall Summary'
      });
      summaryJson.push(
        {
          item1: 'Completeness',
          item2: `${reportUtil.tasksCompletenesRate}%`
        },
        {
          item1: 'Timeliness',
          item2: `${reportUtil.tasksTimelinessRate}%`
        },
        {
          item1: 'Total Hours Spent',
          item2: `${reportUtil.totalHoursSpent}`
        },
        {
          item1: 'Total Days Spent',
          item2: `${reportUtil.totalDaysSpent}`
        },
        { item1: '' },
        { item1: 'Overall Distribution by Status' },
        {
          item1: 'Open',
          item2: 'In Progress',
          item3: 'On review',
          item4: 'Closed/Completed',
          item5: 'Total'
        },
        {
          item1: `${reportUtil.openTasksCount}`,
          item2: `${reportUtil.inProgressStatusTaksCount}`,
          item3: `${reportUtil.onReviewTasksCount}`,
          item4: `${reportUtil.onCloseTasksCount}`,
          item5: `${reportUtil.totalTasks}`
        },
        { item1: '' },
        { item1: 'Overall Distribution by Project/List Name' },
        {
          item1: 'Project/List Name',
          item2: 'Open',
          item3: 'In Progress',
          item4: 'On review',
          item5: 'Closed/Completed',
          item6: 'Total'
        }
      );
      const tasksByProjectList = reportUtil.tasksByProject;
      for (const project of keys(tasksByProjectList).sort()) {
        const projectReportUtil = new ReportUtil(tasksByProjectList[project]);
        summaryJson.push({
          item1: `${project}`,
          item2: `${projectReportUtil.openTasksCount}`,
          item3: `${projectReportUtil.inProgressStatusTaksCount}`,
          item4: `${projectReportUtil.onReviewTasksCount}`,
          item5: `${projectReportUtil.onCloseTasksCount}`,
          item6: `${projectReportUtil.totalTasks}`
        });
      }
    } catch (error) {}
    return summaryJson;
  }

  static overallTaskByProjectSummary(allTasks: ApiProjectTaskModel[]): any {
    const summaryJson: any[] = [];
    try {
      const reportUtil = new ReportUtil(allTasks);
      const tasksByProjectList = reportUtil.tasksByProject;
      for (const project of keys(tasksByProjectList).sort()) {
        const projectUpReportUtil = new ReportUtil(tasksByProjectList[project]);
        summaryJson.push(
          { item1: `${project}` },
          {
            item1: 'Completeness',
            item2: `${projectUpReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${projectUpReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${projectUpReportUtil.totalHoursSpent}`
          },
          {
            item1: 'Total Days Spent',
            item2: `${projectUpReportUtil.totalDaysSpent}`
          },
          { item1: 'Distribution by Status' },
          {
            item1: 'Open',
            item2: 'In Progress',
            item3: 'On review',
            item4: 'Closed/Completed',
            item5: 'Total'
          },
          {
            item1: `${projectUpReportUtil.openTasksCount}`,
            item2: `${projectUpReportUtil.inProgressStatusTaksCount}`,
            item3: `${projectUpReportUtil.onReviewTasksCount}`,
            item4: `${projectUpReportUtil.onCloseTasksCount}`,
            item5: `${projectUpReportUtil.totalTasks}`
          },
          { item1: 'Distribution by Assignee and status' },
          {
            item1: 'Assignee',
            item2: 'Completeness',
            item3: 'Timeliness',
            item4: 'Hours Spent',
            item5: 'Open',
            item6: 'In Progress',
            item7: 'On review',
            item8: 'Closed/Completed',
            item9: 'Total'
          }
        );
        const tasksByAssignee = projectUpReportUtil.tasksByAssignee;
        for (const assignee of keys(tasksByAssignee).sort()) {
          const assigneeReportUtil = new ReportUtil(tasksByAssignee[assignee]);
          summaryJson.push({
            item1: `${assignee}`,
            item2: `${assigneeReportUtil.tasksCompletenesRate}`,
            item3: `${assigneeReportUtil.tasksTimelinessRate}`,
            item4: `${assigneeReportUtil.totalHoursSpent}`,
            item5: `${assigneeReportUtil.openTasksCount}`,
            item6: `${assigneeReportUtil.inProgressStatusTaksCount}`,
            item7: `${assigneeReportUtil.onReviewTasksCount}`,
            item8: `${assigneeReportUtil.onCloseTasksCount}`,
            item9: `${assigneeReportUtil.totalTasks}`
          });
        }
        summaryJson.push({ item1: '' });
      }
    } catch (error) {}
    return summaryJson;
  }

  static overallTaskByAssignedSummary(allTasks: ApiProjectTaskModel[]): any {
    const summaryJson: any[] = [];
    try {
      const clickUpReportUtil = new ReportUtil(allTasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee).sort()) {
        const assigneeReportUtil = new ReportUtil(tasksByAssignee[assignee]);
        summaryJson.push(
          { item1: `${assignee}` },
          {
            item1: 'Completeness',
            item2: `${assigneeReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${assigneeReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${assigneeReportUtil.totalHoursSpent}`
          },
          {
            item1: 'Total Days Spent',
            item2: `${assigneeReportUtil.totalDaysSpent}`
          },
          { item1: 'Distribution by Status' },
          {
            item1: 'Open',
            item2: 'In Progress',
            item3: 'On review',
            item4: 'Closed/Completed',
            item5: 'Total'
          },
          {
            item1: `${assigneeReportUtil.openTasksCount}`,
            item2: `${assigneeReportUtil.inProgressStatusTaksCount}`,
            item3: `${assigneeReportUtil.onReviewTasksCount}`,
            item4: `${assigneeReportUtil.onCloseTasksCount}`,
            item5: `${assigneeReportUtil.totalTasks}`
          },
          { item1: 'Distribution by Project/List Name' }
        );
        const tasksByProjectList = assigneeReportUtil.tasksByProject;
        for (const project of keys(tasksByProjectList).sort()) {
          const projectReportUtil = new ReportUtil(tasksByProjectList[project]);
          summaryJson.push({
            item1: `${project}`,
            item2: `${projectReportUtil.totalTasks}`
          });
        }
        summaryJson.push({ item1: '' });
      }
    } catch (error) {}
    return summaryJson;
  }

  static payrollSummayByIndiviadual(allTasks: ApiProjectTaskModel[]): any {
    const summaryJson: any[] = [];
    try {
      const reportUtil = new ReportUtil(allTasks);
      const tasksByAssignee = reportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee).sort()) {
        const assigneeReportUtil = new ReportUtil(tasksByAssignee[assignee]);
        summaryJson.push(
          { item1: `${assignee}` },
          {
            item1: 'Completeness',
            item2: `${assigneeReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${assigneeReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${assigneeReportUtil.totalHoursSpent}`
          },
          { item1: 'Distribution by Project using hours' },
          {
            item1: 'Project',
            item2: 'Project Code',
            item3: 'Number Hours Spent',
            item4: 'Percentage'
          }
        );
        const tasksByProjectList = assigneeReportUtil.tasksByProject;
        const totalHoursSpent = parseFloat(assigneeReportUtil.totalHoursSpent);
        for (const project of keys(tasksByProjectList).sort()) {
          const projectReportUtil = new ReportUtil(tasksByProjectList[project]);
          const hoursSpentOnProject = parseFloat(
            projectReportUtil.totalHoursSpent
          );
          const percentage = (
            (hoursSpentOnProject / totalHoursSpent) *
            100
          ).toFixed(1);
          const projectObj = first(projectReportUtil.sortedTasksByDate);
          summaryJson.push({
            item1: `${project}`,
            item2: `${projectObj?.projectCode}`,
            item3: `${hoursSpentOnProject}`,
            item4: `${percentage} %`
          });
        }
        summaryJson.push({ item1: '' });
      }
    } catch (error) {}
    return summaryJson;
  }
}
