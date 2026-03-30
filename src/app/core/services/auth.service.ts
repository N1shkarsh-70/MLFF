import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  role: string;
  name: string;
  email: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'mlff_auth_token';
  private readonly USER_KEY = 'mlff_user';

  isAuthenticated = signal<boolean>(this.checkAuth());
  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'mlff@123') {
      const user: User = {
        username: 'admin',
        role: 'Super Admin',
        name: 'System Administrator',
        email: 'admin@mlff.gov.in'
      };
      localStorage.setItem(this.STORAGE_KEY, 'mock_jwt_token_' + Date.now());
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.isAuthenticated.set(true);
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private checkAuth(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
