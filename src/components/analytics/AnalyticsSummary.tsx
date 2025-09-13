import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import { Card } from '../ui';
import type { RootState } from '../../store';

export const AnalyticsSummary: React.FC = () => {
  const navigate = useNavigate();
  const { boards } = useSelector((state: RootState) => state.boards);
  const { lists } = useSelector((state: RootState) => state.lists);
  const { cards } = useSelector((state: RootState) => state.cards);

  const summaryStats = useMemo(() => {
    const totalCards = cards.length;
    
    // Find completed cards (in lists with 'done' or 'complete' in title)
    const completedCards = cards.filter(card => {
      const cardList = lists.find(list => list.id === card.listId);
      return cardList?.title.toLowerCase().includes('done') || 
             cardList?.title.toLowerCase().includes('complete');
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentActivity = cards.filter(card => 
      new Date(card.createdAt) >= weekAgo
    ).length;

    const overdueTasks = cards.filter(card => 
      card.dueDate && new Date(card.dueDate) < now && !completedCards.includes(card)
    ).length;

    return {
      totalBoards: boards.length,
      totalCards,
      completedCards: completedCards.length,
      completionRate: totalCards > 0 ? Math.round((completedCards.length / totalCards) * 100) : 0,
      recentActivity,
      overdueTasks
    };
  }, [boards, lists, cards]);

  if (boards.length === 0) {
    return null; // Don't show analytics summary if no boards
  }

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-700 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Quick Analytics
        </h3>
        <button
          onClick={() => navigate('/analytics')}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          View detailed analytics
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{summaryStats.totalBoards}</div>
          <div className="text-sm text-gray-400">Active Boards</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-100">{summaryStats.totalCards}</div>
          <div className="text-sm text-gray-400">Total Cards</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{summaryStats.completionRate}%</div>
          <div className="text-sm text-gray-400">Completion Rate</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${summaryStats.recentActivity > 0 ? 'text-purple-400' : 'text-gray-500'}`}>
            +{summaryStats.recentActivity}
          </div>
          <div className="text-sm text-gray-400">This Week</div>
        </div>
      </div>

      {summaryStats.overdueTasks > 0 && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
          <div className="flex items-center text-red-400 text-sm">
            <Activity className="h-4 w-4 mr-2" />
            You have {summaryStats.overdueTasks} overdue task{summaryStats.overdueTasks !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {summaryStats.recentActivity > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Good progress this week!
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            {summaryStats.completedCards} completed
          </div>
        </div>
      )}
    </Card>
  );
};
