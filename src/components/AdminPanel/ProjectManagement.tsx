import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types/auth';
import { Plus, Edit, Trash2, X, Check, ExternalLink } from 'lucide-react';
import { ApolloCard, ApolloCardContent, ApolloCardHeader, ApolloCardTitle } from '@/components/ui/apollo-card';
import { ApolloButton } from '@/components/ui/apollo-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ProjectManagement: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      description: ''
    });
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(formData.url);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, {
        name: formData.name,
        url: formData.url,
        description: formData.description
      });
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
    } else {
      addProject({
        name: formData.name,
        url: formData.url,
        description: formData.description
      });
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      url: project.url,
      description: project.description || ''
    });
    setEditingProject(project);
    setShowAddForm(true);
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will also remove access for all users.')) {
      deleteProject(projectId);
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <ApolloButton onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </ApolloButton>
      </div>

      {(showAddForm || editingProject) && (
        <ApolloCard variant="elevated">
          <ApolloCardHeader>
            <div className="flex items-center justify-between">
              <ApolloCardTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </ApolloCardTitle>
              <ApolloButton 
                variant="apollo-outline" 
                size="sm" 
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </ApolloButton>
            </div>
          </ApolloCardHeader>
          <ApolloCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">Project URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description (optional)"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <ApolloButton type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </ApolloButton>
                <ApolloButton variant="apollo-outline" type="button" onClick={resetForm}>
                  Cancel
                </ApolloButton>
              </div>
            </form>
          </ApolloCardContent>
        </ApolloCard>
      )}

      <ApolloCard>
        <ApolloCardHeader>
          <ApolloCardTitle>All Projects</ApolloCardTitle>
        </ApolloCardHeader>
        <ApolloCardContent>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.url}</p>
                  {project.description && (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <ApolloButton variant="apollo-outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </ApolloButton>
                  <ApolloButton variant="apollo-outline" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </ApolloButton>
                </div>
              </div>
            ))}
            
            {projects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No projects found. Create your first project to get started.
              </div>
            )}
          </div>
        </ApolloCardContent>
      </ApolloCard>
    </div>
  );
};

export default ProjectManagement;