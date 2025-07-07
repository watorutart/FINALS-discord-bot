import * as cron from 'node-cron';

export class WeeklyScheduler {
  private task: cron.ScheduledTask | null = null;

  schedule(cronExpression: string, callback: () => void): void {
    if (!this.isValidCronExpression(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    if (!callback) {
      throw new Error('Callback function is required');
    }

    this.task = cron.schedule(cronExpression, callback, {
      scheduled: true,
      timezone: 'Asia/Tokyo'
    });
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
    }
  }

  isRunning(): boolean {
    return this.task !== null;
  }

  getNextExecutionTime(cronExpression: string): Date {
    if (!this.isValidCronExpression(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    const cronParser = require('cron-parser');
    try {
      const interval = cronParser.parseExpression(cronExpression, {
        tz: 'Asia/Tokyo'
      });
      return interval.next().toDate();
    } catch (error) {
      throw new Error('Invalid cron expression');
    }
  }

  private isValidCronExpression(expression: string): boolean {
    if (!expression || typeof expression !== 'string') {
      return false;
    }

    const cronRegex = /^(\*|[0-5]?\d) (\*|[01]?\d|2[0-3]) (\*|[01]?\d|2\d|3[01]) (\*|[01]?\d) (\*|[0-6])$/;
    return cronRegex.test(expression);
  }
}