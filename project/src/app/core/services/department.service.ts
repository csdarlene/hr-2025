import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departments: Department[] = [
    { id: '1', name: 'Java' },
    { id: '2', name: 'Apex' },
    { id: '3', name: 'Be Informed' },
    { id: '4', name: 'Business Intelligence' },
    { id: '5', name: 'Office Management' },
    { id: '6', name: 'Delivery Management' },
    { id: '7', name: 'People and Culture' },
    { id: '8', name: 'DBA' }
  ];

  constructor() { }

  getDepartments(): Observable<Department[]> {
    return of(this.departments).pipe(delay(300));
  }

  getDepartmentById(id: string): Observable<Department | undefined> {
    const department = this.departments.find(d => d.id === id);
    return of(department).pipe(delay(300));
  }

  createDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    const newDepartment: Department = {
      ...department,
      id: (this.departments.length + 1).toString()
    };
    
    this.departments.push(newDepartment);
    return of(newDepartment).pipe(delay(500));
  }

  updateDepartment(id: string, updates: Partial<Department>): Observable<Department | undefined> {
    const deptIndex = this.departments.findIndex(d => d.id === id);
    if (deptIndex === -1) {
      return of(undefined);
    }
    
    const updatedDepartment = {
      ...this.departments[deptIndex],
      ...updates
    };
    
    this.departments[deptIndex] = updatedDepartment;
    return of(updatedDepartment).pipe(delay(500));
  }

  deleteDepartment(id: string): Observable<boolean> {
    const initialLength = this.departments.length;
    this.departments = this.departments.filter(d => d.id !== id);
    const deleted = this.departments.length < initialLength;
    return of(deleted).pipe(delay(500));
  }
}