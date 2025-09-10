import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Project } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  projects: Project[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded data for demo
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Apollo Admin',
    email: 'admin@apollotyres.com',
    password: 'apollo123',
    role: 'major_admin',
    projectAccess: [],
    createdAt: new Date('2024-01-01'),
  }
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Apollo Passenger Tyres',
    url: 'https://apollotyres.com/passenger',
    description: 'Passenger vehicle tyre management system',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Apollo Commercial Tyres',
    url: 'https://apollotyres.com/commercial',
    description: 'Commercial vehicle tyre management system',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Apollo Racing Division',
    url: 'https://apollotyres.com/racing',
    description: 'High-performance racing tyre division',
    createdAt: new Date('2024-01-01'),
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
      });
      localStorage.setItem('apollo_auth', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('apollo_auth');
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Also remove from users' project access
    setUsers(prev => prev.map(u => ({
      ...u,
      projectAccess: u.projectAccess.filter(pId => pId !== id)
    })));
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('apollo_auth');
    if (savedAuth) {
      try {
        const user = JSON.parse(savedAuth);
        setAuthState({
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('apollo_auth');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      users,
      projects,
      addUser,
      addProject,
      updateProject,
      deleteProject,
      updateUser,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};