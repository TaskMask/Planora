import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Calendar,
  Users,
  Target,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui';
import type { RootState, AppDispatch } from '../store';
import { fetchLists } from '../features/lists';
import { fetchCards } from '../features/cards';
import { useAuth } from '../hooks/useAuth';

interface BoardAnalytics {
  boardId: string;
  boardTitle: string;
  totalCards: number;
  completedCards: number;
  inProgressCards: number;
  todoCards: number;
  completionRate: number;
  averageCardsPerList: number;
  lastActivity: string;
  createdThisWeek: number;
  completedThisWeek: number;
  overdueTasks: number;
}

interface ProductivityMetrics {
  totalBoards: number;
  totalCards: number;
  completedCards: number;
  overallCompletionRate: number;
  averageTasksPerBoard: number;
  mostActiveBoard: string;
  recentActivity: number;
  weeklyProgress: {
    week: string;
    created: number;
    completed: number;
  }[];
}

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { boards } = useSelector((state: RootState) => state.boards);
  const { lists } = useSelector((state: RootState) => state.lists);
  const { cards } = useSelector((state: RootState) => state.cards);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Determine if user is in demo mode for navigation
  const isDemoMode = user?.id === 'demo-user-123';
  const boardsUrl = isDemoMode ? '/demo' : '/boards';

  // Load lists and cards when component mounts
  useEffect(() => {
    if (boards.length > 0 && user?.id) {
      boards.forEach(board => {
        dispatch(fetchLists({ boardId: board.id, userId: user.id }));
        dispatch(fetchCards(board.id));
      });
    }
  }, [dispatch, boards, user?.id]);

  const boardAnalytics: BoardAnalytics[] = useMemo(() => {
    return boards.map(board => {
      // Get lists for this board
      const boardLists = lists.filter(list => list.boardId === board.id);
      
      // Get all cards for this board
      const allCards = cards.filter(card => 
        boardLists.some(list => list.id === card.listId)
      );
      
      // Find completed cards (in lists with 'done' or 'complete' in title)
      const completedCards = allCards.filter(card => {
        const cardList = lists.find(list => list.id === card.listId);
        return cardList?.title.toLowerCase().includes('done') || 
               cardList?.title.toLowerCase().includes('complete');
      });
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const cardsCreatedThisWeek = allCards.filter(card => 
        new Date(card.createdAt) >= weekAgo
      ).length;
      
      const cardsCompletedThisWeek = completedCards.filter(card => 
        card.updatedAt && new Date(card.updatedAt) >= weekAgo
      ).length;

      const overdueTasks = allCards.filter(card => 
        card.dueDate && new Date(card.dueDate) < now && !completedCards.includes(card)
      ).length;

      // Find todo cards (in lists with 'todo' or 'backlog' in title)
      const todoCards = allCards.filter(card => {
        const cardList = lists.find(list => list.id === card.listId);
        return cardList?.title.toLowerCase().includes('todo') || 
               cardList?.title.toLowerCase().includes('backlog');
      });

      return {
        boardId: board.id,
        boardTitle: board.title,
        totalCards: allCards.length,
        completedCards: completedCards.length,
        inProgressCards: allCards.length - completedCards.length,
        todoCards: todoCards.length,
        completionRate: allCards.length > 0 ? (completedCards.length / allCards.length) * 100 : 0,
        averageCardsPerList: boardLists.length > 0 ? allCards.length / boardLists.length : 0,
        lastActivity: board.updatedAt,
        createdThisWeek: cardsCreatedThisWeek,
        completedThisWeek: cardsCompletedThisWeek,
        overdueTasks
      };
    });
  }, [boards, lists, cards]);

  const productivityMetrics: ProductivityMetrics = useMemo(() => {
    // If no boardAnalytics data, return default values
    if (boardAnalytics.length === 0) {
      return {
        totalBoards: 0,
        totalCards: 0,
        completedCards: 0,
        overallCompletionRate: 0,
        averageTasksPerBoard: 0,
        mostActiveBoard: 'No boards available',
        recentActivity: 0,
        weeklyProgress: []
      };
    }

    const totalCards = boardAnalytics.reduce((sum, board) => sum + board.totalCards, 0);
    const completedCards = boardAnalytics.reduce((sum, board) => sum + board.completedCards, 0);
    const mostActiveBoard = boardAnalytics.length > 0 
      ? boardAnalytics.reduce((prev, current) => 
          prev.createdThisWeek > current.createdThisWeek ? prev : current
        )
      : null;

    // Generate weekly progress data for the last 4 weeks
    const weeklyProgress = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekCreated = boardAnalytics.reduce((sum, board) => 
        sum + board.createdThisWeek, 0
      );
      const weekCompleted = boardAnalytics.reduce((sum, board) => 
        sum + board.completedThisWeek, 0
      );

      weeklyProgress.push({
        week: `Week ${4 - i}`,
        created: i === 0 ? weekCreated : Math.floor(Math.random() * 20) + 5, // Mock data for previous weeks
        completed: i === 0 ? weekCompleted : Math.floor(Math.random() * 15) + 3
      });
    }

    return {
      totalBoards: boards.length,
      totalCards,
      completedCards,
      overallCompletionRate: totalCards > 0 ? (completedCards / totalCards) * 100 : 0,
      averageTasksPerBoard: boards.length > 0 ? totalCards / boards.length : 0,
      mostActiveBoard: mostActiveBoard?.boardTitle || 'No boards',
      recentActivity: boardAnalytics.reduce((sum, board) => sum + board.createdThisWeek, 0),
      weeklyProgress
    };
  }, [boardAnalytics, boards]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    onClick?: () => void;
  }> = ({ title, value, icon, trend, trendValue, onClick }) => (
    <div 
      className={`relative overflow-hidden transition-all duration-700 group ${
        onClick ? 'cursor-pointer hover:scale-110 hover:-translate-y-2' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-gray-900/10 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-between p-0">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-gray-300 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white transition-all duration-300 group-hover:text-gray-200 mb-3">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center text-sm transition-all duration-300 ${
              trend === 'up' ? 'text-green-400 group-hover:text-green-300' : 
              trend === 'down' ? 'text-red-400 group-hover:text-red-300' : 'text-gray-400 group-hover:text-gray-300'
            }`}>
              {trend === 'up' && <ArrowUp className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 animate-pulse" />}
              {trend === 'down' && <ArrowDown className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 animate-pulse" />}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="text-violet-400 transition-all duration-500 group-hover:text-violet-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </div>
  );

  // Show loading state if data is still loading
  if (boards.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96 animate-fadeIn">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4 shadow-lg shadow-violet-500/30"></div>
              <p className="text-gray-300 animate-fadeInUp delay-300">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Darker Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%)',
          opacity: 1
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Animated Header */}
        <div className="flex flex-col items-center justify-center mb-12 animate-fadeInUp">
          <div className="text-center animate-slideInFromLeft">
            <h1 className="text-5xl font-bold text-white animate-glow">
              Analytics Dashboard
            </h1>
            <p className="mt-4 text-gray-400 animate-fadeIn delay-200 text-xl">
              Track your productivity and board performance 📊
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6 animate-slideInFromRight delay-300">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'all')}
              className="bg-gray-900 border border-gray-700 text-gray-200 px-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 hover:border-gray-600 hover:shadow-lg"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Enhanced Overview Stats with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fadeInUp delay-400">
            <div className="card-aesthetic p-6 hover:scale-105 transition-all duration-500">
              <StatCard
                title="Total Boards"
                value={productivityMetrics.totalBoards}
                icon={<BarChart3 className="h-8 w-8" />}
                onClick={() => navigate(boardsUrl)}
              />
            </div>
          </div>
          <div className="animate-fadeInUp delay-500">
            <div className="card-aesthetic p-6 hover:scale-105 transition-all duration-500">
              <StatCard
                title="Total Cards"
                value={productivityMetrics.totalCards}
                icon={<Target className="h-8 w-8" />}
                trend="up"
                trendValue={`+${productivityMetrics.recentActivity} this week`}
              />
            </div>
          </div>
          <div className="animate-fadeInUp delay-600">
            <div className="card-aesthetic p-6 hover:scale-105 transition-all duration-500">
              <StatCard
                title="Completion Rate"
                value={`${productivityMetrics.overallCompletionRate.toFixed(1)}%`}
                icon={<CheckCircle className="h-8 w-8" />}
                trend={productivityMetrics.overallCompletionRate >= 50 ? 'up' : 'neutral'}
                trendValue={`${productivityMetrics.completedCards}/${productivityMetrics.totalCards} completed`}
              />
            </div>
          </div>
          <div className="animate-fadeInUp delay-700">
            <div className="card-aesthetic p-6 hover:scale-105 transition-all duration-500">
              <StatCard
                title="Active This Week"
                value={productivityMetrics.recentActivity}
                icon={<Activity className="h-8 w-8" />}
                trend="up"
                trendValue="Cards created"
              />
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart with animations */}
        <div className="mb-8 animate-fadeInUp delay-800">
          <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center justify-center animate-slideInFromLeft delay-900">
              <TrendingUp className="h-5 w-5 mr-2" />
              Weekly Progress
            </h3>
            <div className="space-y-4">
              {productivityMetrics.weeklyProgress.map((week, index) => (
                <div key={index} className="flex items-center space-x-4 animate-slideInFromLeft" style={{ animationDelay: `${1000 + index * 100}ms` }}>
                  <div className="w-16 text-sm text-gray-400">{week.week}</div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-2xl h-3 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-2xl transition-all duration-1000 hover:from-blue-400 hover:to-blue-500"
                        style={{ 
                          width: `${Math.min((week.created / 25) * 100, 100)}%`,
                          animationDelay: `${1200 + index * 100}ms`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-300 w-16">{week.created} created</span>
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-2xl h-3 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-2xl transition-all duration-1000 hover:from-green-400 hover:to-green-500"
                        style={{ 
                          width: `${Math.min((week.completed / 20) * 100, 100)}%`,
                          animationDelay: `${1300 + index * 100}ms`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-300 w-16">{week.completed} done</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Board Analytics with staggered animations */}
        <div className="mb-8 animate-fadeInUp delay-1200">
          <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center justify-center animate-slideInFromLeft delay-1300">
            <PieChart className="h-5 w-5 mr-2" />
            Board Performance
          </h3>
          <div className="cards-grid-2">
            {boardAnalytics.map((board, index) => (
              <div 
                key={board.boardId}
                className="animate-fadeInUp"
                style={{ animationDelay: `${1400 + index * 150}ms` }}
              >
                <Card 
                  className="p-6 bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm transform"
                  onClick={() => navigate(isDemoMode ? `/demo/boards/${board.boardId}` : `/boards/${board.boardId}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-100 truncate group-hover:text-blue-100 transition-colors duration-300">{board.boardTitle}</h4>
                    <div className="flex items-center space-x-2">
                      {board.overdueTasks > 0 && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          {board.overdueTasks} overdue
                        </span>
                      )}
                      <span className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300">
                        {board.completionRate.toFixed(0)}% complete
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Cards</span>
                      <span className="text-gray-100">{board.totalCards}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Completed</span>
                      <span className="text-green-400">{board.completedCards}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">In Progress</span>
                      <span className="text-yellow-400">{board.inProgressCards}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Created This Week</span>
                      <span className="text-blue-400">+{board.createdThisWeek}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${board.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights with animations */}
        <div className="animate-fadeInUp delay-1600">
          <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center justify-center animate-slideInFromLeft delay-1700">
            <Activity className="h-5 w-5 mr-2" />
            Quick Insights
          </h3>
          <div className="cards-grid-3">
            <div className="animate-fadeInUp delay-1800">
              <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-blue-400 animate-float" />
                  <div>
                    <p className="text-sm text-gray-400">Most Active Board</p>
                    <p className="text-lg font-medium text-gray-100 hover:text-blue-100 transition-colors duration-300">{productivityMetrics.mostActiveBoard}</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="animate-fadeInUp delay-1900">
              <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-green-400 animate-float delay-100" />
                  <div>
                    <p className="text-sm text-gray-400">Avg Cards per Board</p>
                    <p className="text-lg font-medium text-gray-100 hover:text-green-100 transition-colors duration-300">
                      {productivityMetrics.averageTasksPerBoard.toFixed(1)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="animate-fadeInUp delay-2000">
              <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-purple-400 animate-float delay-200" />
                  <div>
                    <p className="text-sm text-gray-400">Total Overdue</p>
                    <p className="text-lg font-medium text-red-400 hover:text-red-300 transition-colors duration-300">
                      {boardAnalytics.reduce((sum, board) => sum + board.overdueTasks, 0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
