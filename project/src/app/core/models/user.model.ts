export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  MANAGEMENT = 'MANAGEMENT',
  TEAM_LEAD = 'TEAM_LEAD',
  TEAM_MEMBER = 'TEAM_MEMBER'
}

export enum Level {
  BOOTCAMPER = 'BOOTCAMPER',
  JUNIOR = 'JUNIOR',
  MEDIOR = 'MEDIOR',
  SENIOR = 'SENIOR'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  startDate: Date;
  role: UserRole;
  position: string;
  departmentId: string;
  level: Level;
  projectIds: string[];
  profileImage?: string;
}