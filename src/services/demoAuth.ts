// Demo authentication service for portfolio demonstration
import type { User } from '../types';

const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'demo@planora.com',
  displayName: 'Demo User',
  photoURL: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export class DemoAuthService {
  private currentUser: User | null = null;
  private authStateChangedCallbacks: Array<(user: User | null) => void> = [];

  constructor() {
    // Check if demo user is in localStorage
    const storedDemoUser = localStorage.getItem('planora_demo_user');
    if (storedDemoUser) {
      this.currentUser = JSON.parse(storedDemoUser);
    }
  }

  async signInDemo(): Promise<User> {
    this.currentUser = DEMO_USER;
    localStorage.setItem('planora_demo_user', JSON.stringify(DEMO_USER));
    this.notifyAuthStateChanged();
    return DEMO_USER;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('planora_demo_user');
    this.notifyAuthStateChanged();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateChangedCallbacks.push(callback);
    
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateChangedCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateChangedCallbacks.splice(index, 1);
      }
    };
  }

  private notifyAuthStateChanged(): void {
    this.authStateChangedCallbacks.forEach(callback => {
      callback(this.currentUser);
    });
  }

  isDemoMode(): boolean {
    return this.currentUser?.id === 'demo-user-123';
  }

  clearDemoData(): void {
    this.currentUser = null;
    localStorage.removeItem('planora_demo_user');
    this.notifyAuthStateChanged();
  }
}

export const demoAuthService = new DemoAuthService();
