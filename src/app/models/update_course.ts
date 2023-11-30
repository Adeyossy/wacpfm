import { UpdateCourseRecord } from "./update_course_record";

export type UpdateCourse = {
  updateCourseId: string;
  theme: string;
  createdBy: string;
  startDate: number;
  endDate: number;
  participants: UpdateCourseRecord[];
}