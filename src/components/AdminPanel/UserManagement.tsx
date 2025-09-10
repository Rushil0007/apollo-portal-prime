import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/auth';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { ApolloCard, ApolloCardContent, ApolloCardHeader, ApolloCardTitle } from '@/components/ui/apollo-card';
import { ApolloButton } from '@/components/ui/apollo-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { users, projects, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
    projectAccess: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      projectAccess: []
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        projectAccess: formData.projectAccess
      });
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        projectAccess: formData.projectAccess,
        createdBy: currentUser?.id
      });
      toast({
        title: "Success",
        description: "User created successfully.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      projectAccess: user.projectAccess
    });
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    }
  };

  const handleProjectToggle = (projectId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      projectAccess: checked 
        ? [...prev.projectAccess, projectId]
        : prev.projectAccess.filter(id => id !== projectId)
    }));
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'major_admin': return 'Major Admin';
      case 'sub_admin': return 'Sub Admin';
      case 'user': return 'User';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <ApolloButton onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </ApolloButton>
      </div>

      {(showAddForm || editingUser) && (
        <ApolloCard variant="elevated">
          <ApolloCardHeader>
            <div className="flex items-center justify-between">
              <ApolloCardTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter user name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="sub_admin">Sub Admin</SelectItem>
                      {currentUser?.role === 'major_admin' && (
                        <SelectItem value="major_admin">Major Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Project Access</Label>
                <div className="mt-2 space-y-2">
                  {projects.map(project => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={project.id}
                        checked={formData.projectAccess.includes(project.id)}
                        onCheckedChange={(checked) => handleProjectToggle(project.id, !!checked)}
                      />
                      <Label htmlFor={project.id} className="text-sm font-normal">
                        {project.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <ApolloButton type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  {editingUser ? 'Update User' : 'Create User'}
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
          <ApolloCardTitle>All Users</ApolloCardTitle>
        </ApolloCardHeader>
        <ApolloCardContent>
          <div className="space-y-4">
            {users.filter(u => u.id !== currentUser?.id).map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Access to {user.projectAccess.length} project{user.projectAccess.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ApolloButton variant="apollo-outline" size="sm" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </ApolloButton>
                  <ApolloButton variant="apollo-outline" size="sm" onClick={() => handleDelete(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </ApolloButton>
                </div>
              </div>
            ))}
            
            {users.filter(u => u.id !== currentUser?.id).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found. Create your first user to get started.
              </div>
            )}
          </div>
        </ApolloCardContent>
      </ApolloCard>
    </div>
  );
};

export default UserManagement;