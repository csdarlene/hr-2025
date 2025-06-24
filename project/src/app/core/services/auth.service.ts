import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole, Level } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private testUsers: { [key: string]: User } = {
    'admin@example.com': {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phoneNumber: '555-0001',
      startDate: new Date('2022-01-01'),
      role: UserRole.ADMIN,
      position: 'System Administrator',
      departmentId: '1',
      level: Level.SENIOR,
      projectIds: ['1', '2'],
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    'hr@example.com': {
      id: '2',
      firstName: 'HR',
      lastName: 'Manager',
      email: 'hr@example.com',
      phoneNumber: '555-0002',
      startDate: new Date('2022-02-01'),
      role: UserRole.HR,
      position: 'HR Manager',
      departmentId: '7',
      level: Level.SENIOR,
      projectIds: [],
      profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    'manager@example.com': {
      id: '3',
      firstName: 'Management',
      lastName: 'User',
      email: 'manager@example.com',
      phoneNumber: '555-0003',
      startDate: new Date('2022-03-01'),
      role: UserRole.MANAGEMENT,
      position: 'Department Manager',
      departmentId: '1',
      level: Level.SENIOR,
      projectIds: ['1', '2', '3'],
      profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    'lead@example.com': {
      id: '4',
      firstName: 'Team',
      lastName: 'Lead',
      email: 'lead@example.com',
      phoneNumber: '555-0004',
      startDate: new Date('2022-04-01'),
      role: UserRole.TEAM_LEAD,
      position: 'Senior Developer',
      departmentId: '1',
      level: Level.SENIOR,
      projectIds: ['1'],
      profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    'member@example.com': {
      id: '5',
      firstName: 'Team',
      lastName: 'Member',
      email: 'member@example.com',
      phoneNumber: '555-0005',
      startDate: new Date('2022-05-01'),
      role: UserRole.TEAM_MEMBER,
      position: 'Developer',
      departmentId: '1',
      level: Level.JUNIOR,
      projectIds: ['1'],
      profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  };
  
  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
  
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  get userRole(): UserRole | null {
    return this.currentUserSubject.value?.role || null;
  }
  
  login(email: string, password: string): Observable<User> {
    const user = this.testUsers[email];
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return of(user).pipe(
      delay(1000),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  isAdmin(): boolean {
    return this.userRole === UserRole.ADMIN;
  }
  
  isHR(): boolean {
    return this.userRole === UserRole.HR;
  }
  
  isManagement(): boolean {
    return this.userRole === UserRole.MANAGEMENT;
  }
  
  isTeamLead(): boolean {
    return this.userRole === UserRole.TEAM_LEAD;
  }
  
  isTeamMember(): boolean {
    return this.userRole === UserRole.TEAM_MEMBER;
  }

  canEdit(): boolean {
    return this.isAdmin() || this.isManagement() || this.isTeamLead();
  }

  canDelete(): boolean {
    return this.isAdmin() || this.isManagement();
  }

  hasTeamAccess(): boolean {
    return this.isAdmin() || this.isManagement() || this.isTeamLead();
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // Simulate password update
    return of(true).pipe(delay(1000));
  }
}