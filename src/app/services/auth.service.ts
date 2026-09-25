import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedKey = 'eco_authenticated';

  login(email: string, pass: string): boolean {
    if (email && pass) {
      localStorage.setItem(this.isAuthenticatedKey, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.isAuthenticatedKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.isAuthenticatedKey) === 'true';
  }
}
