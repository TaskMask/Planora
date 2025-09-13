// Helper function to seed sample data for analytics demo
import { v4 as uuidv4 } from 'uuid';
import type { Board, List, Card } from '../types';
import type { AppDispatch } from '../store';
import { setLists } from '../features/lists/listsSlice';
import { setCards } from '../features/cards/cardsSlice';
import { setBoards } from '../features/boards/boardsSlice';

export const seedSampleData = (userId: string) => {
  // Create portfolio-ready sample boards
  const sampleBoards: Board[] = [
    {
      id: 'sample-board-1',
      title: 'E-Commerce Platform Development',
      description: 'Full-stack React/Node.js e-commerce platform with microservices architecture',
      ownerId: userId,
      members: [userId],
      permissions: [],
      style: {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardStyle: 'default',
        fontSize: 'medium',
        spacing: 'normal'
      },
      isPublic: false,
      allowComments: true,
      allowVoting: true,
      isArchived: false,
      tags: ['react', 'nodejs', 'microservices', 'e-commerce'],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-board-2',
      title: 'Mobile App Launch Strategy',
      description: 'Go-to-market strategy for React Native mobile application',
      ownerId: userId,
      members: [userId],
      permissions: [],
      style: {
        backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        cardStyle: 'default',
        fontSize: 'medium',
        spacing: 'normal'
      },
      isPublic: true,
      allowComments: true,
      allowVoting: false,
      isArchived: false,
      tags: ['mobile', 'react-native', 'marketing', 'launch'],
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-board-3',
      title: 'DevOps & Infrastructure',
      description: 'Cloud infrastructure setup and CI/CD pipeline implementation',
      ownerId: userId,
      members: [userId],
      permissions: [],
      style: {
        backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        cardStyle: 'default',
        fontSize: 'medium',
        spacing: 'normal'
      },
      isPublic: false,
      allowComments: true,
      allowVoting: true,
      isArchived: false,
      tags: ['devops', 'aws', 'docker', 'ci-cd'],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Create enhanced sample lists
  const sampleLists: List[] = [
    // E-Commerce Platform board lists
    {
      id: 'list-1-1',
      title: '📋 Backlog',
      boardId: 'sample-board-1',
      position: 0,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-1-2',
      title: '🔄 In Development',
      boardId: 'sample-board-1',
      position: 1,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-1-3',
      title: '🧪 Testing',
      boardId: 'sample-board-1',
      position: 2,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-1-4',
      title: '✅ Deployed',
      boardId: 'sample-board-1',
      position: 3,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Mobile App Launch board lists
    {
      id: 'list-2-1',
      title: '💡 Ideas',
      boardId: 'sample-board-2',
      position: 0,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-2-2',
      title: '📝 Planning',
      boardId: 'sample-board-2',
      position: 1,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-2-3',
      title: '🚀 Executing',
      boardId: 'sample-board-2',
      position: 2,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-2-4',
      title: '📊 Launched',
      boardId: 'sample-board-2',
      position: 3,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    // DevOps board lists
    {
      id: 'list-3-1',
      title: '🔧 Setup',
      boardId: 'sample-board-3',
      position: 0,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-3-2',
      title: '⚙️ Configuration',
      boardId: 'sample-board-3',
      position: 1,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'list-3-3',
      title: '🔍 Monitoring',
      boardId: 'sample-board-3',
      position: 2,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Create portfolio-worthy sample cards
  const sampleCards: Card[] = [
    // E-Commerce Platform cards
    {
      id: uuidv4(),
      title: 'Implement JWT Authentication & Authorization',
      description: 'Build secure authentication system with refresh tokens, role-based access control, and OAuth2 integration for Google/GitHub. Include middleware for route protection and session management.',
      listId: 'list-1-4', // Deployed
      position: 0,
      labels: [
        { id: '1', name: 'Backend', color: '#10B981' },
        { id: '2', name: 'Security', color: '#EF4444' },
        { id: '3', name: 'Critical', color: '#F59E0B' }
      ],
      assignees: [userId],
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Build React Shopping Cart with Redux Toolkit',
      description: 'Implement persistent shopping cart with local storage, quantity management, price calculations, and checkout flow. Include cart abandonment recovery and wishlist functionality.',
      listId: 'list-1-4', // Deployed
      position: 1,
      labels: [
        { id: '4', name: 'Frontend', color: '#3B82F6' },
        { id: '5', name: 'React', color: '#06B6D4' },
        { id: '6', name: 'Redux', color: '#8B5CF6' }
      ],
      assignees: [userId],
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Stripe Payment Integration & Webhooks',
      description: 'Integrate Stripe payment processing with support for multiple currencies, subscription billing, and webhook handling for payment events. Include payment failure handling and refund processing.',
      listId: 'list-1-3', // Testing
      position: 0,
      labels: [
        { id: '7', name: 'Payment', color: '#EC4899' },
        { id: '8', name: 'API', color: '#14B8A6' },
        { id: '2', name: 'Security', color: '#EF4444' }
      ],
      assignees: [userId],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'urgent',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Microservices Architecture with Docker',
      description: 'Containerize services (auth, products, orders, notifications) with Docker Compose. Implement service discovery, load balancing, and inter-service communication with message queues.',
      listId: 'list-1-2', // In Development
      position: 0,
      labels: [
        { id: '9', name: 'DevOps', color: '#F97316' },
        { id: '10', name: 'Docker', color: '#0EA5E9' },
        { id: '11', name: 'Architecture', color: '#6366F1' }
      ],
      assignees: [userId],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Real-time Inventory Management with WebSockets',
      description: 'Build real-time inventory tracking system with Socket.io for live stock updates, low inventory alerts, and automatic reorder notifications. Include admin dashboard for inventory analytics.',
      listId: 'list-1-2', // In Development
      position: 1,
      labels: [
        { id: '12', name: 'Real-time', color: '#84CC16' },
        { id: '13', name: 'WebSocket', color: '#A855F7' },
        { id: '4', name: 'Frontend', color: '#3B82F6' }
      ],
      assignees: [userId],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Advanced Search with Elasticsearch',
      description: 'Implement intelligent product search with autocomplete, filters, faceted search, and AI-powered recommendations. Include search analytics and A/B testing for search algorithms.',
      listId: 'list-1-1', // Backlog
      position: 0,
      labels: [
        { id: '14', name: 'Search', color: '#DC2626' },
        { id: '15', name: 'Elasticsearch', color: '#059669' },
        { id: '16', name: 'AI/ML', color: '#7C3AED' }
      ],
      assignees: [userId],
      priority: 'medium',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Mobile App Launch Strategy cards
    {
      id: uuidv4(),
      title: 'React Native App Store Optimization',
      description: 'Optimize app store listings with keyword research, compelling descriptions, screenshots, and video previews. Implement ASO best practices for maximum discoverability.',
      listId: 'list-2-4', // Launched
      position: 0,
      labels: [
        { id: '17', name: 'ASO', color: '#10B981' },
        { id: '18', name: 'Marketing', color: '#F59E0B' },
        { id: '19', name: 'Mobile', color: '#8B5CF6' }
      ],
      assignees: [userId],
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Influencer Partnership Campaign',
      description: 'Execute strategic influencer partnerships with tech and lifestyle creators. Include content creation guidelines, performance tracking, and ROI analysis for each partnership.',
      listId: 'list-2-3', // Executing
      position: 0,
      labels: [
        { id: '20', name: 'Influencer', color: '#EC4899' },
        { id: '18', name: 'Marketing', color: '#F59E0B' },
        { id: '21', name: 'Partnership', color: '#06B6D4' }
      ],
      assignees: [userId],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'Analytics Dashboard with Firebase & Mixpanel',
      description: 'Implement comprehensive user analytics tracking with custom events, funnel analysis, cohort studies, and retention metrics. Include automated reports and alerts.',
      listId: 'list-2-2', // Planning
      position: 0,
      labels: [
        { id: '22', name: 'Analytics', color: '#0EA5E9' },
        { id: '23', name: 'Firebase', color: '#F97316' },
        { id: '24', name: 'Data', color: '#6366F1' }
      ],
      assignees: [userId],
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },

    // DevOps & Infrastructure cards
    {
      id: uuidv4(),
      title: 'AWS EKS Kubernetes Cluster Setup',
      description: 'Deploy production-ready Kubernetes cluster on AWS EKS with auto-scaling, load balancers, and security best practices. Include monitoring with Prometheus and Grafana.',
      listId: 'list-3-3', // Monitoring
      position: 0,
      labels: [
        { id: '25', name: 'Kubernetes', color: '#326CE5' },
        { id: '26', name: 'AWS', color: '#FF9900' },
        { id: '9', name: 'DevOps', color: '#F97316' }
      ],
      assignees: [userId],
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      title: 'CI/CD Pipeline with GitHub Actions',
      description: 'Build automated deployment pipeline with testing, security scanning, and multi-environment deployments. Include rollback strategies and blue-green deployments.',
      listId: 'list-3-2', // Configuration
      position: 0,
      labels: [
        { id: '27', name: 'CI/CD', color: '#22C55E' },
        { id: '28', name: 'GitHub Actions', color: '#24292E' },
        { id: '29', name: 'Automation', color: '#A855F7' }
      ],
      assignees: [userId],
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      attachments: [],
      createdBy: userId,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return { sampleBoards, sampleLists, sampleCards };
};

export const loadSampleDataToStorage = (userId: string) => {
  const { sampleBoards, sampleLists, sampleCards } = seedSampleData(userId);
  
  // Check user-specific storage
  const userBoardsKey = `planora_boards_${userId}`;
  const userListsKey = `planora_lists_${userId}`;
  const userCardsKey = `planora_cards_${userId}`;
  
  const existingUserBoards = JSON.parse(localStorage.getItem(userBoardsKey) || '[]');
  const existingUserLists = JSON.parse(localStorage.getItem(userListsKey) || '[]');
  const existingUserCards = JSON.parse(localStorage.getItem(userCardsKey) || '[]');
  
  // Only add sample data if no existing user-specific data
  if (existingUserBoards.length === 0) {
    localStorage.setItem(userBoardsKey, JSON.stringify(sampleBoards));
    // Also save to global storage for backward compatibility
    const existingBoards = JSON.parse(localStorage.getItem('planora_boards') || '[]');
    const combinedBoards = [...sampleBoards, ...existingBoards.filter((b: any) => b.ownerId !== userId)];
    localStorage.setItem('planora_boards', JSON.stringify(combinedBoards));
  }
  if (existingUserLists.length === 0) {
    localStorage.setItem(userListsKey, JSON.stringify(sampleLists));
    // Also save to global storage for backward compatibility
    const existingLists = JSON.parse(localStorage.getItem('planora_lists') || '[]');
    const combinedLists = [...sampleLists, ...existingLists];
    localStorage.setItem('planora_lists', JSON.stringify(combinedLists));
  }
  if (existingUserCards.length === 0) {
    localStorage.setItem(userCardsKey, JSON.stringify(sampleCards));
    // Also save to global storage for backward compatibility
    const existingCards = JSON.parse(localStorage.getItem('planora_cards') || '[]');
    const combinedCards = [...sampleCards, ...existingCards];
    localStorage.setItem('planora_cards', JSON.stringify(combinedCards));
  }
};

export const loadSampleDataToRedux = (userId: string, dispatch: AppDispatch) => {
  const { sampleBoards, sampleLists, sampleCards } = seedSampleData(userId);
  
  // Check user-specific storage
  const userBoardsKey = `planora_boards_${userId}`;
  const userListsKey = `planora_lists_${userId}`;
  const userCardsKey = `planora_cards_${userId}`;
  
  const existingUserBoards = JSON.parse(localStorage.getItem(userBoardsKey) || '[]');
  const existingUserLists = JSON.parse(localStorage.getItem(userListsKey) || '[]');
  const existingUserCards = JSON.parse(localStorage.getItem(userCardsKey) || '[]');
  
  // Only add sample data if no existing user-specific data
  if (existingUserBoards.length === 0) {
    localStorage.setItem(userBoardsKey, JSON.stringify(sampleBoards));
    // Also save to global storage for backward compatibility
    const existingBoards = JSON.parse(localStorage.getItem('planora_boards') || '[]');
    const combinedBoards = [...sampleBoards, ...existingBoards.filter((b: any) => b.ownerId !== userId)];
    localStorage.setItem('planora_boards', JSON.stringify(combinedBoards));
    dispatch(setBoards(sampleBoards));
  }
  if (existingUserLists.length === 0) {
    localStorage.setItem(userListsKey, JSON.stringify(sampleLists));
    const existingLists = JSON.parse(localStorage.getItem('planora_lists') || '[]');
    const combinedLists = [...sampleLists, ...existingLists];
    localStorage.setItem('planora_lists', JSON.stringify(combinedLists));
    dispatch(setLists(sampleLists));
  }
  if (existingUserCards.length === 0) {
    localStorage.setItem(userCardsKey, JSON.stringify(sampleCards));
    const existingCards = JSON.parse(localStorage.getItem('planora_cards') || '[]');
    const combinedCards = [...sampleCards, ...existingCards];
    localStorage.setItem('planora_cards', JSON.stringify(combinedCards));
    dispatch(setCards(sampleCards));
  }
};

export const resetSampleData = (userId: string, dispatch: AppDispatch) => {
  // Clear existing user-specific data
  const userBoardsKey = `planora_boards_${userId}`;
  const userListsKey = `planora_lists_${userId}`;
  const userCardsKey = `planora_cards_${userId}`;
  
  localStorage.removeItem(userListsKey);
  localStorage.removeItem(userCardsKey);
  localStorage.removeItem(userBoardsKey);
  
  // Load fresh sample data
  const { sampleBoards, sampleLists, sampleCards } = seedSampleData(userId);
  
  // Save to user-specific localStorage
  localStorage.setItem(userBoardsKey, JSON.stringify(sampleBoards));
  localStorage.setItem(userListsKey, JSON.stringify(sampleLists));
  localStorage.setItem(userCardsKey, JSON.stringify(sampleCards));
  
  // Update Redux state
  dispatch(setBoards(sampleBoards));
  dispatch(setLists(sampleLists));
  dispatch(setCards(sampleCards));
};
