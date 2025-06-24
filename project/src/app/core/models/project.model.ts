export interface Project {
  id: string;
  name: string;
  description: string;
  teamLeadId: string;
  teamMemberIds: string[];
  startDate: Date;
  endDate?: Date;
  departmentId: string;
  status: ProjectStatus;
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}