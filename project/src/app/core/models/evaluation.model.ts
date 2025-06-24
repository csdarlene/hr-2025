export interface EvaluationCriteria {
  id: string;
  description: string;
  category: CriteriaCategory;
  departmentId: string;
  level: string;
}

export enum CriteriaCategory {
  TASKS_AND_RESPONSIBILITIES = 'TakenEnBevoegheden',
  PERSONAL_TRAITS = 'BenodigdePersoonlijkeEigenschappen/Competenties',
  TOOLS_AND_METHODOLOGIES = 'BenodigdeTools/Methodieken',
  JOB_REQUIREMENTS = 'Functie-eisen/Opleiding',
  WORK_EXPERIENCE = 'Werkervaring'
}

export interface EvaluationScore {
  criteriaId: string;
  score: number; // 1-5
  comments?: string;
}

export interface Evaluation {
  id: string;
  userId: string;
  evaluatorId?: string; // Team lead ID if applicable
  projectId: string;
  departmentId: string;
  level: string;
  date: Date;
  type: EvaluationType;
  status: EvaluationStatus;
  scores: EvaluationScore[];
}

export enum EvaluationType {
  SELF = 'SELF',
  TEAM_LEAD = 'TEAM_LEAD',
  FINAL = 'FINAL'
}

export enum EvaluationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED'
}

export interface EvaluationComparison {
  criteriaId: string;
  criteriaDescription: string;
  category: CriteriaCategory;
  selfScore: number;
  teamLeadScore: number;
  difference: number;
  finalScore?: number;
}