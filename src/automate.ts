import * as cron from 'node-cron';
import { JsonResponse } from './types/api';


class Automation {
  private static instance: Automation;
  private jobs: cron.ScheduledTask[] = [];

  private constructor() {}

  public static getInstance(): Automation {
    if (!Automation.instance) {
      Automation.instance = new Automation();
    }
    return Automation.instance;
  }

  public addJob(name: string, schedule: string, task: () => any): any {
    const job = cron.schedule(schedule, () => {
      console.log(`Début de la tâche: ${name}`);
      try {
        task();
      } catch (error) {
        console.error(`Erreur dans ${name}:`, error);
        const response: JsonResponse = {
          success: false,
          message: `Erreur dans la tâche ${name}`,
          error: (error as Error).message
        };
        return response;
      }
    });

    this.jobs.push(job);
    console.log(`Tâche ${name} programmée`);
  }

  public startAll(): void {
    this.jobs.forEach(job => job.start());
  }

  public stopAll(): void {
    this.jobs.forEach(job => job.stop());
  }
}

export default Automation.getInstance();
