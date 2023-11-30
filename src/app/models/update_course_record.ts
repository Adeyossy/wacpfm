export type UpdateCourseRecord = {
  userId: string;
  courseType: 'Membership' | 'Fellowship' | 'TOT';
  paymentId: string;
  role: string;
}