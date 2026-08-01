import { BusinessLessonType } from '@prisma/client';

export interface LessonRecord {
  id?: string;
  type: BusinessLessonType;
  lesson: string;
  evidence?: any;
  context?: any;
  confidenceScore: number;
}

export class BusinessMemoryService {
  private lessons: LessonRecord[] = [];

  public recordLesson(lesson: LessonRecord): void {
    this.lessons.push(lesson);
  }

  public getLessonsByType(type: BusinessLessonType): LessonRecord[] {
    return this.lessons.filter((l) => l.type === type);
  }

  public getHighConfidenceLessons(): LessonRecord[] {
    return this.lessons.filter((l) => l.confidenceScore >= 0.85);
  }
}
