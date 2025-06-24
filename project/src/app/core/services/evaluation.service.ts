import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  Evaluation, 
  EvaluationCriteria, 
  EvaluationScore, 
  EvaluationType, 
  EvaluationStatus,
  EvaluationComparison,
  CriteriaCategory
} from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private evaluations: Evaluation[] = [
    {
      id: '1',
      userId: '1',
      projectId: '1',
      departmentId: '1',
      level: 'SENIOR',
      date: new Date('2024-01-15'),
      type: EvaluationType.SELF,
      status: EvaluationStatus.COMPLETED,
      scores: [
        { criteriaId: 'TR1', score: 4, comments: 'Good understanding of functional designs' },
        { criteriaId: 'TR2', score: 3, comments: 'Can identify most entities correctly' },
        { criteriaId: 'PT1', score: 5, comments: 'Excellent communication skills' },
        { criteriaId: 'TM1', score: 4, comments: 'Proficient with JIRA' }
      ]
    },
    {
      id: '2',
      userId: '1',
      projectId: '1',
      departmentId: '1',
      level: 'SENIOR',
      date: new Date('2024-01-20'),
      type: EvaluationType.TEAM_LEAD,
      status: EvaluationStatus.COMPLETED,
      scores: [
        { criteriaId: 'TR1', score: 4, comments: 'Shows good understanding' },
        { criteriaId: 'TR2', score: 4, comments: 'Identifies entities well' },
        { criteriaId: 'PT1', score: 5, comments: 'Great communicator' },
        { criteriaId: 'TM1', score: 4, comments: 'Uses JIRA effectively' }
      ]
    }
  ];

  private criteria: EvaluationCriteria[] = [
    {
      id: 'TR1',
      description: 'Begrijpt functionele ontwerpen',
      category: CriteriaCategory.TASKS_AND_RESPONSIBILITIES,
      departmentId: '1',
      level: 'SENIOR'
    },
    {
      id: 'TR2',
      description: 'Kan entiteiten identificeren',
      category: CriteriaCategory.TASKS_AND_RESPONSIBILITIES,
      departmentId: '1',
      level: 'SENIOR'
    },
    {
      id: 'PT1',
      description: 'Communicatieve vaardigheden',
      category: CriteriaCategory.PERSONAL_TRAITS,
      departmentId: '1',
      level: 'SENIOR'
    },
    {
      id: 'TM1',
      description: 'JIRA vaardigheid',
      category: CriteriaCategory.TOOLS_AND_METHODOLOGIES,
      departmentId: '1',
      level: 'SENIOR'
    }
  ];

  constructor() {}

  getEvaluationsForUser(userId: string): Observable<Evaluation[]> {
    const userEvals = this.evaluations.filter(e => e.userId === userId);
    return of(userEvals).pipe(delay(300));
  }

  getEvaluationsForProject(projectId: string): Observable<Evaluation[]> {
    const projectEvals = this.evaluations.filter(e => e.projectId === projectId);
    return of(projectEvals).pipe(delay(300));
  }

  getEvaluationById(id: string): Observable<Evaluation | undefined> {
    const evaluation = this.evaluations.find(e => e.id === id);
    return of(evaluation).pipe(delay(300));
  }

  getCriteria(departmentId: string, level: string): Observable<EvaluationCriteria[]> {
    const filteredCriteria = this.criteria.filter(
      c => c.departmentId === departmentId && c.level === level
    );
    return of(filteredCriteria).pipe(delay(300));
  }

  getAllCriteria(): Observable<EvaluationCriteria[]> {
    return of(this.criteria).pipe(delay(300));
  }

  createCriteria(criteria: Omit<EvaluationCriteria, 'id'>): Observable<EvaluationCriteria> {
    const newCriteria: EvaluationCriteria = {
      ...criteria,
      id: `CR${this.criteria.length + 1}`
    };
    
    this.criteria.push(newCriteria);
    return of(newCriteria).pipe(delay(500));
  }

  updateCriteria(id: string, updates: Partial<EvaluationCriteria>): Observable<EvaluationCriteria | undefined> {
    const criteriaIndex = this.criteria.findIndex(c => c.id === id);
    if (criteriaIndex === -1) {
      return of(undefined);
    }
    
    const updatedCriteria = {
      ...this.criteria[criteriaIndex],
      ...updates
    };
    
    this.criteria[criteriaIndex] = updatedCriteria;
    return of(updatedCriteria).pipe(delay(500));
  }

  deleteCriteria(id: string): Observable<boolean> {
    const criteriaIndex = this.criteria.findIndex(c => c.id === id);
    if (criteriaIndex === -1) {
      return of(false);
    }
    
    this.criteria.splice(criteriaIndex, 1);
    return of(true).pipe(delay(500));
  }

  createEvaluation(evaluation: Omit<Evaluation, 'id'>): Observable<Evaluation> {
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: (this.evaluations.length + 1).toString()
    };
    
    this.evaluations.push(newEvaluation);
    return of(newEvaluation).pipe(delay(500));
  }

  updateEvaluation(id: string, updates: Partial<Evaluation>): Observable<Evaluation | undefined> {
    const evalIndex = this.evaluations.findIndex(e => e.id === id);
    if (evalIndex === -1) {
      return of(undefined);
    }
    
    const updatedEval = {
      ...this.evaluations[evalIndex],
      ...updates
    };
    
    this.evaluations[evalIndex] = updatedEval;
    return of(updatedEval).pipe(delay(500));
  }

  getComparisonForUser(userId: string, projectId: string): Observable<EvaluationComparison[]> {
    const selfEval = this.evaluations.find(
      e => e.userId === userId && 
           e.projectId === projectId && 
           e.type === EvaluationType.SELF
    );
    
    const teamLeadEval = this.evaluations.find(
      e => e.userId === userId && 
           e.projectId === projectId && 
           e.type === EvaluationType.TEAM_LEAD
    );
    
    if (!selfEval || !teamLeadEval) {
      return of([]);
    }
    
    const comparisons: EvaluationComparison[] = [];
    
    const criteriaIds = new Set<string>();
    selfEval.scores.forEach(s => criteriaIds.add(s.criteriaId));
    teamLeadEval.scores.forEach(s => criteriaIds.add(s.criteriaId));
    
    criteriaIds.forEach(criteriaId => {
      const criteria = this.criteria.find(c => c.id === criteriaId);
      if (!criteria) return;
      
      const selfScore = selfEval.scores.find(s => s.criteriaId === criteriaId)?.score || 0;
      const teamLeadScore = teamLeadEval.scores.find(s => s.criteriaId === criteriaId)?.score || 0;
      
      const finalEval = this.evaluations.find(
        e => e.userId === userId && 
             e.projectId === projectId && 
             e.type === EvaluationType.FINAL
      );

      const finalScore = finalEval?.scores.find(s => s.criteriaId === criteriaId)?.score;
      
      comparisons.push({
        criteriaId,
        criteriaDescription: criteria.description,
        category: criteria.category,
        selfScore,
        teamLeadScore,
        difference: teamLeadScore - selfScore,
        finalScore
      });
    });
    
    return of(comparisons).pipe(delay(500));
  }
}