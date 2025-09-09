import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  CheckSquare,
  Flag,
  Save,
  Trash2,
  Plus,
  Check
} from 'lucide-react';
import type { Card, Label, User as UserType, ChecklistItem } from '../../types';
import { priorityColors } from '../../data/defaultLabels';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
  onSave: (cardData: Partial<Card>) => void;
  onDelete?: (cardId: string) => void;
  boardMembers?: UserType[];
  boardLabels?: Label[];
  loading?: boolean;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  isOpen,
  onClose,
  card,
  onSave,
  onDelete,
  boardMembers = [],
  boardLabels = [],
  loading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [estimatedHours, setEstimatedHours] = useState<number | ''>('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setDueDate(card.dueDate ? card.dueDate.split('T')[0] : '');
      setPriority(card.priority || 'medium');
      setSelectedLabels(card.labels.map(l => l.id));
      setAssignees(card.assignees || []);
      setChecklist(card.checklist || []);
      setEstimatedHours(card.estimatedHours || '');
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !title.trim()) return;

    const cardLabels = boardLabels.filter(label => selectedLabels.includes(label.id));

    onSave({
      id: card.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
      labels: cardLabels,
      assignees,
      checklist,
      estimatedHours: estimatedHours || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const toggleAssignee = (userId: string) => {
    setAssignees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setChecklist(prev => [...prev, newItem]);
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const removeChecklistItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
  };

  const getCompletedPercentage = () => {
    if (checklist.length === 0) return 0;
    return Math.round((checklist.filter(item => item.completed).length / checklist.length) * 100);
  };

  const isDueSoon = (dueDate: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 3 && daysDiff >= 0;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Card Details</h2>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(card.id)}
                disabled={loading}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex overflow-hidden max-h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                  disabled={loading}
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Add a description..."
                  disabled={loading}
                />
              </div>

              {/* Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    <CheckSquare className="inline w-4 h-4 mr-2" />
                    Checklist {checklist.length > 0 && `(${getCompletedPercentage()}% complete)`}
                  </label>
                </div>

                {checklist.length > 0 && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCompletedPercentage()}%` }}
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {checklist.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                          <button
                            type="button"
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              item.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            {item.completed && <Check size={12} />}
                          </button>
                          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                            {item.text}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                    placeholder="Add checklist item..."
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    disabled={!newChecklistItem.trim()}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-800/30 border-l border-gray-700/50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Due Date & Priority */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  />
                  {dueDate && (
                    <div className="mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full text-white ${
                        isOverdue(dueDate) 
                          ? 'bg-red-500' 
                          : isDueSoon(dueDate) 
                          ? 'bg-amber-500' 
                          : 'bg-gray-600'
                      }`}>
                        {isOverdue(dueDate) ? 'Overdue' : isDueSoon(dueDate) ? 'Due Soon' : 'On Track'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Flag className="inline w-4 h-4 mr-2" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="mt-2">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: priorityColors[priority] }}
                    />
                    <span className="text-sm text-gray-400 capitalize">{priority} priority</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value ? parseFloat(e.target.value) : '')}
                    min="0"
                    step="0.5"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Labels */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    <Tag className="inline w-4 h-4 mr-2" />
                    Labels
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLabelPicker(!showLabelPicker)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {selectedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedLabels.map(labelId => {
                      const label = boardLabels.find(l => l.id === labelId);
                      return label ? (
                        <span
                          key={labelId}
                          className="px-2 py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {showLabelPicker && (
                  <div className="space-y-2 max-h-32 overflow-y-auto p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                    {boardLabels.map(label => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                          selectedLabels.includes(label.id) 
                            ? 'bg-gray-700' 
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="text-white text-sm">{label.name}</span>
                        {selectedLabels.includes(label.id) && (
                          <Check size={14} className="ml-auto text-green-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignees */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    <User className="inline w-4 h-4 mr-2" />
                    Assignees
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {assignees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {assignees.map(userId => {
                      const user = boardMembers.find(u => u.id === userId);
                      return user ? (
                        <div key={userId} className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </div>
                          <span className="text-white text-sm">{user.displayName || user.email}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {showAssigneePicker && (
                  <div className="space-y-2 max-h-32 overflow-y-auto p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                    {boardMembers.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleAssignee(user.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                          assignees.includes(user.id) 
                            ? 'bg-gray-700' 
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white text-sm">{user.displayName || 'User'}</div>
                          <div className="text-gray-400 text-xs">{user.email}</div>
                        </div>
                        {assignees.includes(user.id) && (
                          <Check size={14} className="ml-auto text-green-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
