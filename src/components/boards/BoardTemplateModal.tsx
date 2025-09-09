import React, { useState } from 'react';
import { X, Plus, ArrowRight } from 'lucide-react';
import { boardTemplates } from '../../data/boardTemplates';
import type { BoardTemplate } from '../../data/boardTemplates';

interface BoardTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: BoardTemplate | null, title: string, description: string) => void;
  loading?: boolean;
}

export const BoardTemplateModal: React.FC<BoardTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  loading = false,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'template' | 'details'>('template');

  const handleTemplateSelect = (template: BoardTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      setTitle(template.name);
      setDescription(template.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSelectTemplate(selectedTemplate, title.trim(), description.trim());
  };

  const handleClose = () => {
    if (!loading) {
      setStep('template');
      setSelectedTemplate(null);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const getBackgroundClass = (bgColor: string) => {
    switch (bgColor) {
      case 'ocean':
        return 'from-blue-900 via-blue-800 to-cyan-900';
      case 'forest':
        return 'from-green-900 via-emerald-800 to-teal-900';
      case 'sunset':
        return 'from-orange-900 via-red-800 to-pink-900';
      case 'purple':
        return 'from-purple-900 via-violet-800 to-indigo-900';
      case 'midnight':
        return 'from-slate-900 via-gray-900 to-black';
      default:
        return 'from-gray-900 via-gray-800 to-gray-900';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {step === 'template' ? 'Choose a Template' : 'Board Details'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {step === 'template' 
                ? 'Start with a template or create a blank board'
                : 'Customize your board name and description'
              }
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 'template' ? (
            <div className="space-y-6">
              {/* Blank Board Option */}
              <div
                onClick={() => handleTemplateSelect(null)}
                className="border-2 border-dashed border-gray-600 hover:border-gray-500 hover:bg-gray-800/30 rounded-xl p-6 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Blank Board
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Start from scratch with an empty board
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boardTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`bg-gradient-to-br ${getBackgroundClass(template.backgroundColor)} border border-gray-700/50 hover:border-gray-600 rounded-xl p-6 cursor-pointer transition-all duration-200 group hover:scale-105`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                        {template.name}
                      </h3>
                      
                      <p className="text-white/70 text-sm mb-4">
                        {template.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {template.lists.slice(0, 3).map((list, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-white/80"
                          >
                            {list.title}
                          </span>
                        ))}
                        {template.lists.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-white/80">
                            +{template.lists.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedTemplate && (
                <div className={`bg-gradient-to-br ${getBackgroundClass(selectedTemplate.backgroundColor)} border border-gray-700/50 rounded-xl p-4 mb-6`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <selectedTemplate.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Using template: {selectedTemplate.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {selectedTemplate.lists.length} lists • {selectedTemplate.lists.reduce((acc, list) => acc + (list.cards?.length || 0), 0)} sample cards
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Board Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter board title"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter board description (optional)"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  disabled={loading}
                  maxLength={500}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('template')}
                  disabled={loading}
                  className="px-4 py-3 text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}
                  {loading ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
