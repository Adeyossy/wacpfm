export type User = {
  userId: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  whatsapp: string;
  phoneNumber: number;
  country: string;
  gender: 'Male' | 'Female';
  updateCourseRecords: [];
  examRecords: [];
}