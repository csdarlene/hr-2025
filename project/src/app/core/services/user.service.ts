import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole, Level } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '555-123-4567',
      startDate: new Date('2022-01-15'),
      role: UserRole.TEAM_LEAD,
      position: 'Senior Developer',
      departmentId: '1',
      level: Level.SENIOR,
      projectIds: ['1', '2'],
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '555-987-6543',
      startDate: new Date('2022-03-10'),
      role: UserRole.TEAM_MEMBER,
      position: 'Developer',
      departmentId: '1',
      level: Level.MEDIOR,
      projectIds: ['1'],
      profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phoneNumber: '555-234-5678',
      startDate: new Date('2023-01-05'),
      role: UserRole.TEAM_MEMBER,
      position: 'Junior Developer',
      departmentId: '1',
      level: Level.JUNIOR,
      projectIds: ['1'],
      profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      phoneNumber: '555-345-6789',
      startDate: new Date('2023-02-15'),
      role: UserRole.TEAM_MEMBER,
      position: 'Developer',
      departmentId: '1',
      level: Level.MEDIOR,
      projectIds: ['1'],
      profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      phoneNumber: '555-456-7890',
      startDate: new Date('2023-03-20'),
      role: UserRole.TEAM_MEMBER,
      position: 'Junior Developer',
      departmentId: '1',
      level: Level.JUNIOR,
      projectIds: ['1'],
      profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  ];

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500));
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user).pipe(delay(300));
  }

  getUsersByDepartment(departmentId: string): Observable<User[]> {
    const filteredUsers = this.users.filter(u => u.departmentId === departmentId);
    return of(filteredUsers).pipe(delay(300));
  }

  getUsersByProject(projectId: string): Observable<User[]> {
    const filteredUsers = this.users.filter(u => u.projectIds.includes(projectId));
    return of(filteredUsers).pipe(delay(300));
  }

  getTeamMembers(teamLeadId: string): Observable<User[]> {
    const teamLead = this.users.find(u => u.id === teamLeadId);
    if (!teamLead) {
      return of([]);
    }
    
    const teamMembers = this.users.filter(u => 
      u.role === UserRole.TEAM_MEMBER && 
      u.projectIds.some(p => teamLead.projectIds.includes(p))
    );
    
    return of(teamMembers).pipe(delay(300));
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: (this.users.length + 1).toString()
    };
    
    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User | undefined> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return of(undefined);
    }
    
    const updatedUser = {
      ...this.users[userIndex],
      ...updates
    };
    
    this.users[userIndex] = updatedUser;
    return of(updatedUser).pipe(delay(500));
  }
}