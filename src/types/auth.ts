export type UserRole = 'major_admin' | 'sub_admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  projectAccess: string[];
  createdBy?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}