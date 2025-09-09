import { BookOpen, Target, Users, Calendar, Code, Heart, Briefcase, Home } from 'lucide-react';

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  backgroundColor: string;
  category: 'project' | 'kanban' | 'scrum' | 'personal' | 'business';
  lists: {
    title: string;
    cards?: {
      title: string;
      description?: string;
    }[];
  }[];
}

export const BOARD_THEMES = {
  'gradient-blue': {
    name: 'Ocean Blue',
    gradient: 'from-blue-900 via-blue-800 to-cyan-900',
    primary: 'blue',
    cardStyle: 'glass'
  },
  'gradient-green': {
    name: 'Forest Green', 
    gradient: 'from-green-900 via-emerald-800 to-teal-900',
    primary: 'emerald',
    cardStyle: 'default'
  },
  'gradient-purple': {
    name: 'Royal Purple',
    gradient: 'from-purple-900 via-violet-800 to-indigo-900',
    primary: 'purple',
    cardStyle: 'colorful'
  },
  'gradient-orange': {
    name: 'Sunset Orange',
    gradient: 'from-orange-900 via-red-800 to-pink-900',
    primary: 'orange',
    cardStyle: 'default'
  },
  'gradient-teal': {
    name: 'Tropical Teal',
    gradient: 'from-teal-900 via-cyan-800 to-blue-900',
    primary: 'teal',
    cardStyle: 'minimal'
  },
  'gradient-pink': {
    name: 'Rose Garden',
    gradient: 'from-pink-900 via-rose-800 to-red-900',
    primary: 'pink',
    cardStyle: 'colorful'
  },
  'gradient-red': {
    name: 'Fire Red',
    gradient: 'from-red-900 via-orange-800 to-yellow-900',
    primary: 'red',
    cardStyle: 'default'
  },
  'gradient-indigo': {
    name: 'Midnight Indigo',
    gradient: 'from-indigo-900 via-purple-800 to-blue-900',
    primary: 'indigo',
    cardStyle: 'glass'
  },
  'gradient-gray': {
    name: 'Storm Gray',
    gradient: 'from-gray-900 via-slate-800 to-zinc-900',
    primary: 'gray',
    cardStyle: 'minimal'
  },
  'ocean': {
    name: 'Ocean Classic',
    gradient: 'from-blue-900 via-blue-800 to-cyan-900',
    primary: 'blue',
    cardStyle: 'default'
  },
  'forest': {
    name: 'Forest Classic',
    gradient: 'from-green-900 via-emerald-800 to-teal-900',
    primary: 'green',
    cardStyle: 'default'
  },
  'sunset': {
    name: 'Sunset Classic',
    gradient: 'from-orange-900 via-red-800 to-pink-900',
    primary: 'orange',
    cardStyle: 'default'
  },
  'purple': {
    name: 'Purple Classic',
    gradient: 'from-purple-900 via-violet-800 to-indigo-900',
    primary: 'purple',
    cardStyle: 'default'
  },
  'midnight': {
    name: 'Midnight Classic',
    gradient: 'from-slate-900 via-gray-900 to-black',
    primary: 'gray',
    cardStyle: 'default'
  }
} as const;

export type ThemeKey = keyof typeof BOARD_THEMES;

export const boardTemplates: BoardTemplate[] = [
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Track tasks with To Do, In Progress, and Done columns',
    icon: Target,
    backgroundColor: 'ocean',
    category: 'kanban',
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
    category: 'scrum',
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
    category: 'project',
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
    category: 'business',
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
    category: 'personal',
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
    category: 'business',
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
    category: 'personal',
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
    category: 'personal',
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
