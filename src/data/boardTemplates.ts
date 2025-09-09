import { BookOpen, Target, Users, Calendar, Code, Heart, Briefcase, Home } from 'lucide-react';

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  backgroundColor: string;
  lists: {
    title: string;
    cards?: {
      title: string;
      description?: string;
    }[];
  }[];
}

export const boardTemplates: BoardTemplate[] = [
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Track tasks with To Do, In Progress, and Done columns',
    icon: Target,
    backgroundColor: 'ocean',
    lists: [
      {
        title: 'To Do',
        cards: [
          {
            title: 'Plan project structure',
            description: 'Define the overall project architecture and requirements'
          },
          {
            title: 'Set up development environment',
            description: 'Install necessary tools and configure the workspace'
          }
        ]
      },
      {
        title: 'In Progress',
        cards: [
          {
            title: 'Design user interface',
            description: 'Create wireframes and mockups for the main screens'
          }
        ]
      },
      {
        title: 'Review',
        cards: []
      },
      {
        title: 'Done',
        cards: [
          {
            title: 'Initial project setup',
            description: 'Created repository and basic project structure'
          }
        ]
      }
    ]
  },
  {
    id: 'sprint',
    name: 'Sprint Planning',
    description: 'Organize your agile sprints with backlog and sprint columns',
    icon: Code,
    backgroundColor: 'forest',
    lists: [
      {
        title: 'Product Backlog',
        cards: [
          {
            title: 'User Authentication',
            description: 'Implement login and registration functionality'
          },
          {
            title: 'Dashboard Design',
            description: 'Create an intuitive dashboard for users'
          },
          {
            title: 'Data Analytics',
            description: 'Add reporting and analytics features'
          }
        ]
      },
      {
        title: 'Sprint Backlog',
        cards: [
          {
            title: 'User Login Form',
            description: 'Create responsive login form with validation'
          },
          {
            title: 'Database Schema',
            description: 'Design and implement user database schema'
          }
        ]
      },
      {
        title: 'In Development',
        cards: [
          {
            title: 'API Endpoints',
            description: 'Develop REST API for user management'
          }
        ]
      },
      {
        title: 'Testing',
        cards: []
      },
      {
        title: 'Completed',
        cards: []
      }
    ]
  },
  {
    id: 'team-project',
    name: 'Team Project',
    description: 'Collaborate on team projects with assignments and deadlines',
    icon: Users,
    backgroundColor: 'purple',
    lists: [
      {
        title: 'Ideas & Planning',
        cards: [
          {
            title: 'Brainstorm session',
            description: 'Schedule team brainstorming for new features'
          },
          {
            title: 'Research competitors',
            description: 'Analyze competitor features and pricing'
          }
        ]
      },
      {
        title: 'Assigned Tasks',
        cards: [
          {
            title: 'Design system update',
            description: 'Update design tokens and component library'
          },
          {
            title: 'Performance optimization',
            description: 'Optimize application loading speed'
          }
        ]
      },
      {
        title: 'In Review',
        cards: [
          {
            title: 'Mobile responsiveness',
            description: 'Ensure all pages work well on mobile devices'
          }
        ]
      },
      {
        title: 'Completed',
        cards: [
          {
            title: 'Project kickoff',
            description: 'Initial team meeting and goal setting'
          }
        ]
      }
    ]
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar',
    description: 'Plan and organize content creation and publishing',
    icon: Calendar,
    backgroundColor: 'sunset',
    lists: [
      {
        title: 'Content Ideas',
        cards: [
          {
            title: 'How-to tutorials',
            description: 'Create step-by-step guides for common tasks'
          },
          {
            title: 'Industry insights',
            description: 'Share thoughts on industry trends and news'
          },
          {
            title: 'Behind the scenes',
            description: 'Show the team and company culture'
          }
        ]
      },
      {
        title: 'Writing',
        cards: [
          {
            title: 'Product announcement blog',
            description: 'Write about the new feature launch'
          }
        ]
      },
      {
        title: 'Review & Edit',
        cards: [
          {
            title: 'Case study article',
            description: 'Customer success story and results'
          }
        ]
      },
      {
        title: 'Ready to Publish',
        cards: []
      },
      {
        title: 'Published',
        cards: [
          {
            title: 'Welcome post',
            description: 'Introduction to our company and mission'
          }
        ]
      }
    ]
  },
  {
    id: 'personal',
    name: 'Personal Tasks',
    description: 'Organize your personal goals and daily tasks',
    icon: Heart,
    backgroundColor: 'midnight',
    lists: [
      {
        title: 'Today',
        cards: [
          {
            title: 'Morning workout',
            description: '30 minutes of cardio and strength training'
          },
          {
            title: 'Review emails',
            description: 'Check and respond to important emails'
          }
        ]
      },
      {
        title: 'This Week',
        cards: [
          {
            title: 'Grocery shopping',
            description: 'Buy ingredients for meal prep'
          },
          {
            title: 'Call family',
            description: 'Catch up with parents and siblings'
          },
          {
            title: 'Book dentist appointment',
            description: 'Schedule routine dental checkup'
          }
        ]
      },
      {
        title: 'This Month',
        cards: [
          {
            title: 'Plan vacation',
            description: 'Research destinations and book flights'
          },
          {
            title: 'Home organization',
            description: 'Declutter and organize living spaces'
          }
        ]
      },
      {
        title: 'Someday',
        cards: [
          {
            title: 'Learn a new language',
            description: 'Start Spanish lessons online'
          },
          {
            title: 'Read more books',
            description: 'Set goal to read 24 books this year'
          }
        ]
      }
    ]
  },
  {
    id: 'business',
    name: 'Business Planning',
    description: 'Strategic planning for business goals and objectives',
    icon: Briefcase,
    backgroundColor: 'forest',
    lists: [
      {
        title: 'Strategy',
        cards: [
          {
            title: 'Market analysis',
            description: 'Research target market and customer needs'
          },
          {
            title: 'Competitive analysis',
            description: 'Study competitors and positioning strategy'
          }
        ]
      },
      {
        title: 'Planning',
        cards: [
          {
            title: 'Business model',
            description: 'Define revenue streams and cost structure'
          },
          {
            title: 'Marketing strategy',
            description: 'Plan customer acquisition and retention'
          }
        ]
      },
      {
        title: 'Execution',
        cards: [
          {
            title: 'MVP development',
            description: 'Build minimum viable product for testing'
          }
        ]
      },
      {
        title: 'Review & Optimize',
        cards: []
      }
    ]
  },
  {
    id: 'home-renovation',
    name: 'Home Renovation',
    description: 'Plan and track home improvement projects',
    icon: Home,
    backgroundColor: 'sunset',
    lists: [
      {
        title: 'Planning',
        cards: [
          {
            title: 'Budget planning',
            description: 'Set budget for each room and project'
          },
          {
            title: 'Design inspiration',
            description: 'Collect ideas from Pinterest and magazines'
          }
        ]
      },
      {
        title: 'Shopping',
        cards: [
          {
            title: 'Kitchen fixtures',
            description: 'Choose faucets, lighting, and hardware'
          },
          {
            title: 'Paint colors',
            description: 'Select paint for each room'
          }
        ]
      },
      {
        title: 'In Progress',
        cards: [
          {
            title: 'Living room painting',
            description: 'Prime and paint the living room walls'
          }
        ]
      },
      {
        title: 'Completed',
        cards: [
          {
            title: 'Bathroom renovation',
            description: 'Updated fixtures and retiled shower'
          }
        ]
      }
    ]
  },
  {
    id: 'learning',
    name: 'Learning Goals',
    description: 'Track your learning journey and skill development',
    icon: BookOpen,
    backgroundColor: 'purple',
    lists: [
      {
        title: 'Want to Learn',
        cards: [
          {
            title: 'Python programming',
            description: 'Learn Python for data analysis and automation'
          },
          {
            title: 'Digital photography',
            description: 'Improve photography skills and composition'
          },
          {
            title: 'Cooking techniques',
            description: 'Master basic cooking skills and recipes'
          }
        ]
      },
      {
        title: 'Currently Learning',
        cards: [
          {
            title: 'React development',
            description: 'Building modern web applications with React'
          },
          {
            title: 'Spanish language',
            description: 'Daily practice with language learning app'
          }
        ]
      },
      {
        title: 'Practicing',
        cards: [
          {
            title: 'Git & GitHub',
            description: 'Version control best practices'
          }
        ]
      },
      {
        title: 'Mastered',
        cards: [
          {
            title: 'HTML & CSS',
            description: 'Solid foundation in web development basics'
          }
        ]
      }
    ]
  }
];

export const getTemplateById = (id: string): BoardTemplate | undefined => {
  return boardTemplates.find(template => template.id === id);
};
