import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FolderOpen, Settings, TrendingUp } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import { ApolloCard, ApolloCardContent, ApolloCardHeader, ApolloCardTitle, ApolloCardDescription } from '@/components/ui/apollo-card';
import { ApolloButton } from '@/components/ui/apollo-button';
import UserManagement from '@/components/AdminPanel/UserManagement';
import ProjectManagement from '@/components/AdminPanel/ProjectManagement';

const Dashboard: React.FC = () => {
  const { user, projects } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'projects'>('dashboard');

  if (!user) return null;

  const isAdmin = user.role === 'major_admin' || user.role === 'sub_admin';
  
  // Filter projects based on user access
  const userProjects = isAdmin 
    ? projects 
    : projects.filter(project => user.projectAccess.includes(project.id));

  const stats = {
    totalProjects: projects.length,
    accessibleProjects: userProjects.length,
    recentActivity: 'Active today',
  };

  // Render admin panel tabs
  if (isAdmin && (activeTab === 'users' || activeTab === 'projects')) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg w-fit">
          <ApolloButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </ApolloButton>
          <ApolloButton
            variant={activeTab === 'users' ? 'apollo' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('users')}
          >
            Users
          </ApolloButton>
          <ApolloButton
            variant={activeTab === 'projects' ? 'apollo' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </ApolloButton>
        </div>

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'projects' && <ProjectManagement />}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Navigation Tabs for Admins */}
      {isAdmin && (
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg w-fit">
          <ApolloButton
            variant={activeTab === 'dashboard' ? 'apollo' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </ApolloButton>
          <ApolloButton
            variant={activeTab === 'users' ? 'apollo' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('users')}
          >
            Users
          </ApolloButton>
          <ApolloButton
            variant={activeTab === 'projects' ? 'apollo' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </ApolloButton>
        </div>
      )}

      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isAdmin 
            ? `Manage your Apollo Tyres projects and team members.` 
            : `Access your assigned Apollo Tyres projects.`
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <ApolloCard variant="gradient">
          <ApolloCardHeader>
            <div className="flex items-center justify-between">
              <ApolloCardTitle className="text-lg">
                Accessible Projects
              </ApolloCardTitle>
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
          </ApolloCardHeader>
          <ApolloCardContent>
            <div className="text-3xl font-bold text-primary mb-1">
              {userProjects.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'Total projects' : 'Projects assigned to you'}
            </p>
          </ApolloCardContent>
        </ApolloCard>

        {isAdmin && (
          <ApolloCard variant="gradient">
            <ApolloCardHeader>
              <div className="flex items-center justify-between">
                <ApolloCardTitle className="text-lg">
                  System Access
                </ApolloCardTitle>
                <Settings className="h-6 w-6 text-primary" />
              </div>
            </ApolloCardHeader>
            <ApolloCardContent>
              <div className="text-3xl font-bold text-primary mb-1">
                Full
              </div>
              <p className="text-sm text-muted-foreground">
                {user.role === 'major_admin' ? 'Major Admin' : 'Sub Admin'} privileges
              </p>
            </ApolloCardContent>
          </ApolloCard>
        )}

        <ApolloCard variant="gradient">
          <ApolloCardHeader>
            <div className="flex items-center justify-between">
              <ApolloCardTitle className="text-lg">
                Status
              </ApolloCardTitle>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </ApolloCardHeader>
          <ApolloCardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">
              Active
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.recentActivity}
            </p>
          </ApolloCardContent>
        </ApolloCard>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <ApolloCard variant="elevated" className="animate-slide-up">
          <ApolloCardHeader>
            <ApolloCardTitle className="text-xl">
              Admin Panel
            </ApolloCardTitle>
            <ApolloCardDescription>
              Manage users, projects, and system settings
            </ApolloCardDescription>
          </ApolloCardHeader>
          <ApolloCardContent>
            <div className="flex flex-wrap gap-4">
              <ApolloButton variant="apollo" onClick={() => setActiveTab('users')}>
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </ApolloButton>
              <ApolloButton variant="apollo-outline" onClick={() => setActiveTab('projects')}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Projects
              </ApolloButton>
              <ApolloButton variant="apollo-outline">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </ApolloButton>
            </div>
          </ApolloCardContent>
        </ApolloCard>
      )}

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {isAdmin ? 'All Projects' : 'Your Projects'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {userProjects.length} project{userProjects.length !== 1 ? 's' : ''} available
          </span>
        </div>

        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                hasAccess={isAdmin || user.projectAccess.includes(project.id)}
              />
            ))}
          </div>
        ) : (
          <ApolloCard variant="minimal" className="text-center py-12">
            <ApolloCardContent>
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <ApolloCardTitle className="text-xl mb-2">
                No Projects Available
              </ApolloCardTitle>
              <ApolloCardDescription>
                {isAdmin 
                  ? 'Start by creating your first project.' 
                  : 'Contact your administrator to get access to projects.'
                }
              </ApolloCardDescription>
            </ApolloCardContent>
          </ApolloCard>
        )}
      </div>
    </div>
  );
};

export default Dashboard;