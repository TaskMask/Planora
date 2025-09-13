import { BookOpen, Target, Users, Calendar, Code, Heart, Briefcase, Home } from 'lucide-react';

// Function to convert Tailwind gradient classes to CSS gradients
export const tailwindToCSSGradient = (tailwindGradient: string): string => {
  const gradientMap: { [key: string]: string } = {
    // New light gradients
    'from-blue-100 via-blue-200 to-cyan-100': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #cffafe 100%)',
    'from-green-100 via-emerald-200 to-teal-100': 'linear-gradient(135deg, #dcfce7 0%, #a7f3d0 50%, #ccfbf1 100%)',
    'from-purple-100 via-violet-200 to-indigo-100': 'linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 50%, #e0e7ff 100%)',
    'from-orange-100 via-amber-200 to-yellow-100': 'linear-gradient(135deg, #fed7aa 0%, #fde68a 50%, #fef3c7 100%)',
    'from-teal-100 via-cyan-200 to-blue-100': 'linear-gradient(135deg, #ccfbf1 0%, #a5f3fc 50%, #dbeafe 100%)',
    'from-pink-100 via-rose-200 to-red-100': 'linear-gradient(135deg, #fce7f3 0%, #fecdd3 50%, #fee2e2 100%)',
    'from-red-100 via-orange-200 to-yellow-100': 'linear-gradient(135deg, #fee2e2 0%, #fed7aa 50%, #fef3c7 100%)',
    'from-indigo-100 via-blue-200 to-purple-100': 'linear-gradient(135deg, #e0e7ff 0%, #bfdbfe 50%, #f3e8ff 100%)',
    'from-gray-100 via-slate-200 to-zinc-100': 'linear-gradient(135deg, #f3f4f6 0%, #e2e8f0 50%, #f4f4f5 100%)',
    
    // Medium intensity gradients
    'from-blue-300 via-blue-400 to-cyan-300': 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #67e8f9 100%)',
    'from-green-300 via-emerald-400 to-teal-300': 'linear-gradient(135deg, #86efac 0%, #34d399 50%, #5eead4 100%)',
    'from-orange-300 via-amber-400 to-yellow-300': 'linear-gradient(135deg, #fdba74 0%, #fbbf24 50%, #fde047 100%)',
    'from-purple-300 via-violet-400 to-indigo-300': 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #a5b4fc 100%)',
    'from-slate-300 via-gray-400 to-zinc-300': 'linear-gradient(135deg, #cbd5e1 0%, #9ca3af 50%, #d4d4d8 100%)',
    
    // Legacy dark gradients (for backwards compatibility)
    'from-blue-900 via-blue-800 to-cyan-900': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #164e63 100%)',
    'from-green-900 via-emerald-800 to-teal-900': 'linear-gradient(135deg, #14532d 0%, #065f46 50%, #134e4a 100%)',
    'from-purple-900 via-violet-800 to-indigo-900': 'linear-gradient(135deg, #581c87 0%, #5b21b6 50%, #312e81 100%)',
    'from-orange-900 via-red-800 to-pink-900': 'linear-gradient(135deg, #9a3412 0%, #991b1b 50%, #831843 100%)',
    'from-teal-900 via-cyan-800 to-blue-900': 'linear-gradient(135deg, #134e4a 0%, #155e75 50%, #1e3a8a 100%)',
    'from-pink-900 via-rose-800 to-red-900': 'linear-gradient(135deg, #831843 0%, #9f1239 50%, #7f1d1d 100%)',
    'from-indigo-900 via-purple-800 to-violet-900': 'linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #581c87 100%)',
    'from-yellow-900 via-orange-800 to-red-900': 'linear-gradient(135deg, #713f12 0%, #9a3412 50%, #7f1d1d 100%)',
    'from-gray-900 via-slate-800 to-gray-900': 'linear-gradient(135deg, #111827 0%, #1e293b 50%, #111827 100%)',
    'from-emerald-900 via-green-800 to-lime-900': 'linear-gradient(135deg, #064e3b 0%, #166534 50%, #365314 100%)',
  };
  
  return gradientMap[tailwindGradient] || 'linear-gradient(135deg, #f3f4f6 0%, #e2e8f0 100%)';
};

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
    name: 'Ocean Breeze',
    gradient: 'from-blue-100 via-blue-200 to-cyan-100',
    primary: 'blue',
    cardStyle: 'glass'
  },
  'gradient-green': {
    name: 'Fresh Mint', 
    gradient: 'from-green-100 via-emerald-200 to-teal-100',
    primary: 'emerald',
    cardStyle: 'default'
  },
  'gradient-purple': {
    name: 'Lavender Dreams',
    gradient: 'from-purple-100 via-violet-200 to-indigo-100',
    primary: 'purple',
    cardStyle: 'colorful'
  },
  'gradient-orange': {
    name: 'Warm Sunset',
    gradient: 'from-orange-100 via-amber-200 to-yellow-100',
    primary: 'orange',
    cardStyle: 'default'
  },
  'gradient-teal': {
    name: 'Tropical Waters',
    gradient: 'from-teal-100 via-cyan-200 to-blue-100',
    primary: 'teal',
    cardStyle: 'minimal'
  },
  'gradient-pink': {
    name: 'Rose Petals',
    gradient: 'from-pink-100 via-rose-200 to-red-100',
    primary: 'pink',
    cardStyle: 'colorful'
  },
  'gradient-red': {
    name: 'Coral Sunset',
    gradient: 'from-red-100 via-orange-200 to-yellow-100',
    primary: 'red',
    cardStyle: 'default'
  },
  'gradient-indigo': {
    name: 'Soft Sky',
    gradient: 'from-indigo-100 via-blue-200 to-purple-100',
    primary: 'indigo',
    cardStyle: 'glass'
  },
  'gradient-gray': {
    name: 'Morning Mist',
    gradient: 'from-gray-100 via-slate-200 to-zinc-100',
    primary: 'gray',
    cardStyle: 'minimal'
  },
  'ocean': {
    name: 'Deep Ocean',
    gradient: 'from-blue-300 via-blue-400 to-cyan-300',
    primary: 'blue',
    cardStyle: 'default'
  },
  'forest': {
    name: 'Forest Grove',
    gradient: 'from-green-300 via-emerald-400 to-teal-300',
    primary: 'green',
    cardStyle: 'default'
  },
  'sunset': {
    name: 'Golden Hour',
    gradient: 'from-orange-300 via-amber-400 to-yellow-300',
    primary: 'orange',
    cardStyle: 'default'
  },
  'purple': {
    name: 'Soft Purple',
    gradient: 'from-purple-300 via-violet-400 to-indigo-300',
    primary: 'purple',
    cardStyle: 'default'
  },
  'midnight': {
    name: 'Charcoal',
    gradient: 'from-slate-300 via-gray-400 to-zinc-300',
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
