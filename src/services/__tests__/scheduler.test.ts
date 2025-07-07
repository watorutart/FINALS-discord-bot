import { WeeklyScheduler } from '../scheduler';

jest.mock('node-cron', () => ({
  schedule: jest.fn().mockReturnValue({
    stop: jest.fn()
  })
}));

describe('WeeklyScheduler', () => {
  let scheduler: WeeklyScheduler;
  let mockCallback: jest.Mock;

  beforeEach(() => {
    scheduler = new WeeklyScheduler();
    mockCallback = jest.fn();
  });

  describe('schedule', () => {
    it('should validate cron expression format', () => {
      const invalidCron = 'invalid-cron-expression';

      expect(() => {
        scheduler.schedule(invalidCron, mockCallback);
      }).toThrow('Invalid cron expression');
    });

    it('should accept valid weekly cron expression', () => {
      const validWeeklyCron = '0 9 * * 1'; // 毎週月曜日9時

      expect(() => {
        scheduler.schedule(validWeeklyCron, mockCallback);
      }).not.toThrow();
    });

    it('should accept callback function', () => {
      const cron = '0 9 * * 1';

      expect(() => {
        scheduler.schedule(cron, mockCallback);
      }).not.toThrow();
    });

    it('should throw error for null callback', () => {
      const cron = '0 9 * * 1';

      expect(() => {
        scheduler.schedule(cron, null as any);
      }).toThrow('Callback function is required');
    });
  });

  describe('stop', () => {
    it('should stop scheduled task', () => {
      const cron = '0 9 * * 1';
      scheduler.schedule(cron, mockCallback);

      expect(() => {
        scheduler.stop();
      }).not.toThrow();
    });

    it('should handle stop when no task is scheduled', () => {
      expect(() => {
        scheduler.stop();
      }).not.toThrow();
    });
  });

  describe('isRunning', () => {
    it('should return false when no task is scheduled', () => {
      expect(scheduler.isRunning()).toBe(false);
    });

    it('should return true when task is scheduled', () => {
      const cron = '0 9 * * 1';
      scheduler.schedule(cron, mockCallback);

      expect(scheduler.isRunning()).toBe(true);
    });

    it('should return false after stopping', () => {
      const cron = '0 9 * * 1';
      scheduler.schedule(cron, mockCallback);
      scheduler.stop();

      expect(scheduler.isRunning()).toBe(false);
    });
  });

  describe('getNextExecutionTime', () => {
    it('should return next execution time for valid cron', () => {
      const cron = '0 9 * * 1';
      
      const nextTime = scheduler.getNextExecutionTime(cron);
      
      expect(nextTime).toBeInstanceOf(Date);
      expect(nextTime.getTime()).toBeGreaterThan(Date.now());
    });

    it('should throw error for invalid cron', () => {
      const invalidCron = 'invalid';

      expect(() => {
        scheduler.getNextExecutionTime(invalidCron);
      }).toThrow('Invalid cron expression');
    });
  });
});