import { filter, first, keys } from 'lodash';
import { ApiProjectTaskModel } from '../models/api-project-task-model';
import { ClickUpReportUtil } from './click-report-util';
import { TASK_CLOSED_STATUS } from '../constants/click-up-excel-file-constant';
import { AppUtil } from './app-util';

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
      new ClickUpReportUtil(tasksByAssignee[assignee]).sortedTasksByDate,
      (task) =>
        TASK_CLOSED_STATUS.includes(task.status) &&
        parseFloat(task.timeSpent) > 0
    );
    const timeSheetReportUtil = new ClickUpReportUtil(tasks);
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
      const clickUpReportUtil = new ClickUpReportUtil(allTasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee)) {
        const tasks = filter(
          new ClickUpReportUtil(tasksByAssignee[assignee]).sortedTasksByDate,
          (task) =>
            TASK_CLOSED_STATUS.includes(task.status) &&
            parseFloat(task.timeSpent) > 0
        );
        const numberOfWeekEndDays = 2 * parseInt(`${workingDays / 5}`, 10);
        const assigneeReportUtil = new ClickUpReportUtil(tasks);
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
      const clickUpReportUtil = new ClickUpReportUtil(allTasks);
      summaryJson.push({
        item1: 'Overall Summary'
      });
      summaryJson.push(
        {
          item1: 'Completeness',
          item2: `${clickUpReportUtil.tasksCompletenesRate}%`
        },
        {
          item1: 'Timeliness',
          item2: `${clickUpReportUtil.tasksTimelinessRate}%`
        },
        {
          item1: 'Total Hours Spent',
          item2: `${clickUpReportUtil.totalHoursSpent}`
        },
        {
          item1: 'Total Days Spent',
          item2: `${clickUpReportUtil.totalDaysSpent}`
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
          item1: `${clickUpReportUtil.openTasksCount}`,
          item2: `${clickUpReportUtil.inProgressStatusTaksCount}`,
          item3: `${clickUpReportUtil.onReviewTasksCount}`,
          item4: `${clickUpReportUtil.onCloseTasksCount}`,
          item5: `${clickUpReportUtil.totalTasks}`
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
      const tasksByProjectList = clickUpReportUtil.tasksByProject;
      for (const project of keys(tasksByProjectList).sort()) {
        const projectClickUpReportUtil = new ClickUpReportUtil(
          tasksByProjectList[project]
        );
        summaryJson.push({
          item1: `${project}`,
          item2: `${projectClickUpReportUtil.openTasksCount}`,
          item3: `${projectClickUpReportUtil.inProgressStatusTaksCount}`,
          item4: `${projectClickUpReportUtil.onReviewTasksCount}`,
          item5: `${projectClickUpReportUtil.onCloseTasksCount}`,
          item6: `${projectClickUpReportUtil.totalTasks}`
        });
      }
    } catch (error) {}
    return summaryJson;
  }

  static overallTaskByProjectSummary(allTasks: ApiProjectTaskModel[]): any {
    const summaryJson: any[] = [];
    try {
      const clickUpReportUtil = new ClickUpReportUtil(allTasks);
      const tasksByProjectList = clickUpReportUtil.tasksByProject;
      for (const project of keys(tasksByProjectList).sort()) {
        const projectClickUpReportUtil = new ClickUpReportUtil(
          tasksByProjectList[project]
        );
        summaryJson.push(
          { item1: `${project}` },
          {
            item1: 'Completeness',
            item2: `${projectClickUpReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${projectClickUpReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${projectClickUpReportUtil.totalHoursSpent}`
          },
          {
            item1: 'Total Days Spent',
            item2: `${projectClickUpReportUtil.totalDaysSpent}`
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
            item1: `${projectClickUpReportUtil.openTasksCount}`,
            item2: `${projectClickUpReportUtil.inProgressStatusTaksCount}`,
            item3: `${projectClickUpReportUtil.onReviewTasksCount}`,
            item4: `${projectClickUpReportUtil.onCloseTasksCount}`,
            item5: `${projectClickUpReportUtil.totalTasks}`
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
        const tasksByAssignee = projectClickUpReportUtil.tasksByAssignee;
        for (const assignee of keys(tasksByAssignee).sort()) {
          const assigneeClickUpReportUtil = new ClickUpReportUtil(
            tasksByAssignee[assignee]
          );
          summaryJson.push({
            item1: `${assignee}`,
            item2: `${assigneeClickUpReportUtil.tasksCompletenesRate}`,
            item3: `${assigneeClickUpReportUtil.tasksTimelinessRate}`,
            item4: `${assigneeClickUpReportUtil.totalHoursSpent}`,
            item5: `${assigneeClickUpReportUtil.openTasksCount}`,
            item6: `${assigneeClickUpReportUtil.inProgressStatusTaksCount}`,
            item7: `${assigneeClickUpReportUtil.onReviewTasksCount}`,
            item8: `${assigneeClickUpReportUtil.onCloseTasksCount}`,
            item9: `${assigneeClickUpReportUtil.totalTasks}`
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
      const clickUpReportUtil = new ClickUpReportUtil(allTasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee).sort()) {
        const assigneeClickUpReportUtil = new ClickUpReportUtil(
          tasksByAssignee[assignee]
        );
        summaryJson.push(
          { item1: `${assignee}` },
          {
            item1: 'Completeness',
            item2: `${assigneeClickUpReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${assigneeClickUpReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${assigneeClickUpReportUtil.totalHoursSpent}`
          },
          {
            item1: 'Total Days Spent',
            item2: `${assigneeClickUpReportUtil.totalDaysSpent}`
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
            item1: `${assigneeClickUpReportUtil.openTasksCount}`,
            item2: `${assigneeClickUpReportUtil.inProgressStatusTaksCount}`,
            item3: `${assigneeClickUpReportUtil.onReviewTasksCount}`,
            item4: `${assigneeClickUpReportUtil.onCloseTasksCount}`,
            item5: `${assigneeClickUpReportUtil.totalTasks}`
          },
          { item1: 'Distribution by Project/List Name' }
        );
        const tasksByProjectList = assigneeClickUpReportUtil.tasksByProject;
        for (const project of keys(tasksByProjectList).sort()) {
          const projectClickUpReportUtil = new ClickUpReportUtil(
            tasksByProjectList[project]
          );
          summaryJson.push({
            item1: `${project}`,
            item2: `${projectClickUpReportUtil.totalTasks}`
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
      const clickUpReportUtil = new ClickUpReportUtil(allTasks);
      const tasksByAssignee = clickUpReportUtil.tasksByAssignee;
      for (const assignee of keys(tasksByAssignee).sort()) {
        const assigneeClickUpReportUtil = new ClickUpReportUtil(
          tasksByAssignee[assignee]
        );
        summaryJson.push(
          { item1: `${assignee}` },
          {
            item1: 'Completeness',
            item2: `${assigneeClickUpReportUtil.tasksCompletenesRate}%`
          },
          {
            item1: 'Timeliness',
            item2: `${assigneeClickUpReportUtil.tasksTimelinessRate}%`
          },
          {
            item1: 'Total Hours Spent',
            item2: `${assigneeClickUpReportUtil.totalHoursSpent}`
          },
          { item1: 'Distribution by Project using hours' },
          {
            item1: 'Project',
            item2: 'Project Code',
            item3: 'Number Hours Spent',
            item4: 'Percentage'
          }
        );
        const tasksByProjectList = assigneeClickUpReportUtil.tasksByProject;
        const totalHoursSpent = parseFloat(
          assigneeClickUpReportUtil.totalHoursSpent
        );
        for (const project of keys(tasksByProjectList).sort()) {
          const projectClickUpReportUtil = new ClickUpReportUtil(
            tasksByProjectList[project]
          );
          const hoursSpentOnProject = parseFloat(
            projectClickUpReportUtil.totalHoursSpent
          );
          const percentage = (
            (hoursSpentOnProject / totalHoursSpent) *
            100
          ).toFixed(1);
          const projectObj = first(projectClickUpReportUtil.sortedTasksByDate);
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
