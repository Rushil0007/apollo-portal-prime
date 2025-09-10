import React from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { Project } from '@/types/auth';
import { ApolloCard, ApolloCardContent, ApolloCardHeader, ApolloCardTitle, ApolloCardDescription } from '@/components/ui/apollo-card';
import { ApolloButton } from '@/components/ui/apollo-button';
import { useToast } from '@/hooks/use-toast';

interface ProjectCardProps {
  project: Project;
  hasAccess: boolean;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, hasAccess, onClick }) => {
  const { toast } = useToast();

  const handleClick = () => {
    if (hasAccess) {
      // Open project URL in new tab
      window.open(project.url, '_blank');
      onClick?.();
    } else {
      toast({
        title: "Access Denied",
        description: "You do not have access to this project.",
        variant: "destructive",
      });
    }
  };

  return (
    <ApolloCard 
      variant={hasAccess ? "elevated" : "minimal"}
      className={`cursor-pointer group transition-all duration-300 ${
        hasAccess 
          ? 'hover:shadow-elevated hover:-translate-y-2' 
          : 'opacity-60 hover:opacity-80'
      }`}
      onClick={handleClick}
    >
      <ApolloCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <ApolloCardTitle className="group-hover:text-primary transition-colors">
              {project.name}
            </ApolloCardTitle>
            {project.description && (
              <ApolloCardDescription className="mt-2">
                {project.description}
              </ApolloCardDescription>
            )}
          </div>
          <div className="ml-4">
            {hasAccess ? (
              <ExternalLink className="h-5 w-5 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </ApolloCardHeader>

      <ApolloCardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {hasAccess ? 'Click to access project' : 'Access restricted'}
          </div>
          
          {hasAccess && (
            <ApolloButton 
              variant="apollo-outline" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Open
            </ApolloButton>
          )}
        </div>

        {/* Access Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            hasAccess ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className={`text-xs font-medium ${
            hasAccess ? 'text-green-600' : 'text-red-600'
          }`}>
            {hasAccess ? 'Access Granted' : 'No Access'}
          </span>
        </div>
      </ApolloCardContent>
    </ApolloCard>
  );
};

export default ProjectCard;