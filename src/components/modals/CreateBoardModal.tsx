import React, { useState } from 'react';
import { X, Settings, Users } from 'lucide-react';
import { Button } from '../ui';
import { boardTemplates, BOARD_THEMES, tailwindToCSSGradient } from '../../data/boardTemplates';

type ThemeKey = keyof typeof BOARD_THEMES;
import type { BoardStyle } from '../../types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (boardData: {
    title: string;
    description: string;
    templateId?: string;
    style: BoardStyle;
    isPublic: boolean;
  }) => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<'template' | 'customize' | 'settings'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('gradient-blue');
  const [cardStyle, setCardStyle] = useState<'default' | 'minimal' | 'colorful' | 'glass'>('default');
  const [isPublic, setIsPublic] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: null, name: 'All Templates', count: boardTemplates.length + 1 },
    { id: 'project', name: 'Project Management', count: boardTemplates.filter(t => t.category === 'project').length },
    { id: 'kanban', name: 'Kanban', count: boardTemplates.filter(t => t.category === 'kanban').length },
    { id: 'scrum', name: 'Scrum', count: boardTemplates.filter(t => t.category === 'scrum').length },
    { id: 'personal', name: 'Personal', count: boardTemplates.filter(t => t.category === 'personal').length },
    { id: 'business', name: 'Business', count: boardTemplates.filter(t => t.category === 'business').length },
  ];

  const filteredTemplates = selectedCategory
    ? boardTemplates.filter(template => template.category === selectedCategory)
    : boardTemplates;

  const handleNext = () => {
    if (step === 'template') setStep('customize');
    else if (step === 'customize') setStep('settings');
  };

  const handleBack = () => {
    if (step === 'settings') setStep('customize');
    else if (step === 'customize') setStep('template');
  };

  const canProceed = () => {
    if (step === 'template') return selectedTemplate !== null;
    if (step === 'customize') return boardTitle.trim().length > 0;
    return true;
  };

  const handleSubmit = () => {
    const template = (selectedTemplate && selectedTemplate !== 'blank') 
      ? boardTemplates.find(t => t.id === selectedTemplate) 
      : null;
    
    // Convert Tailwind gradient to CSS gradient
    const selectedThemeGradient = BOARD_THEMES[selectedTheme]?.gradient || 'from-gray-600 to-gray-700';
    const cssGradient = tailwindToCSSGradient(selectedThemeGradient);
    
    onSubmit({
      title: boardTitle || template?.name || 'New Board',
      description: boardDescription || template?.description || '',
      templateId: (selectedTemplate && selectedTemplate !== 'blank') ? selectedTemplate : undefined,
      style: {
        backgroundColor: cssGradient, // Use the CSS gradient instead of theme key
        cardStyle,
        fontSize: 'medium',
        spacing: 'normal'
      },
      isPublic
    });

    // Reset form
    setStep('template');
    setSelectedTemplate(null);
    setBoardTitle('');
    setBoardDescription('');
    setSelectedTheme('gradient-blue');
    setCardStyle('default');
    setIsPublic(false);
    setSelectedCategory(null);
  };

  const renderTemplateStep = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id || 'all'}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Blank Board Option */}
      <div
        onClick={() => setSelectedTemplate('blank')}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          selectedTemplate === 'blank'
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-100">Blank Board</h4>
            <p className="text-sm text-gray-400">Start with an empty board and customize it yourself</p>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${BOARD_THEMES[template.backgroundColor as ThemeKey]?.gradient || 'from-gray-600 to-gray-700'} rounded-lg flex items-center justify-center`}>
                <template.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">{template.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{template.lists.length} lists</span>
                  <span>{template.lists.reduce((acc, list) => acc + (list.cards?.length || 0), 0)} cards</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomizeStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Board Title *</label>
        <input
          type="text"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          placeholder="Enter board title..."
          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={boardDescription}
          onChange={(e) => setBoardDescription(e.target.value)}
          placeholder="Describe your board..."
          rows={3}
          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Background Theme</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => (
            <div
              key={key}
              onClick={() => setSelectedTheme(key as ThemeKey)}
              className={`relative p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                selectedTheme === key ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className={`w-full h-12 bg-gradient-to-r ${theme.gradient} rounded-md mb-2`} />
              <p className="text-xs text-gray-300 text-center">{theme.name}</p>
              {selectedTheme === key && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Card Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'default', name: 'Default', desc: 'Clean and simple' },
            { id: 'minimal', name: 'Minimal', desc: 'Less visual clutter' },
            { id: 'colorful', name: 'Colorful', desc: 'Vibrant and bright' },
            { id: 'glass', name: 'Glass', desc: 'Modern glassmorphism' }
          ].map(style => (
            <div
              key={style.id}
              onClick={() => setCardStyle(style.id as any)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-gray-500 ${
                cardStyle === style.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 bg-gray-800/50'
              }`}
            >
              <div className="text-sm font-medium text-gray-100">{style.name}</div>
              <div className="text-xs text-gray-400">{style.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h4 className="font-medium text-gray-100 mb-2">Preview</h4>
        <div className={`w-full h-24 bg-gradient-to-r ${BOARD_THEMES[selectedTheme].gradient} rounded-lg flex items-center justify-center`}>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-white font-medium">{boardTitle || 'Board Title'}</div>
            <div className="text-white/70 text-sm">{cardStyle.charAt(0).toUpperCase() + cardStyle.slice(1)} style</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-100">Public Board</div>
              <div className="text-sm text-gray-400">Anyone with the link can view this board</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h4 className="font-medium text-gray-100 mb-3">Board Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Title:</span>
            <span className="text-gray-100">{boardTitle || 'New Board'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Template:</span>
            <span className="text-gray-100">
              {selectedTemplate === 'blank' ? 'Blank Board' : 
               selectedTemplate ? boardTemplates.find(t => t.id === selectedTemplate)?.name : 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Theme:</span>
            <span className="text-gray-100">{BOARD_THEMES[selectedTheme].name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Visibility:</span>
            <span className="text-gray-100">{isPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Create New Board</h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${step === 'template' ? 'bg-blue-500' : 'bg-gray-600'}`} />
              <div className={`w-2 h-2 rounded-full ${step === 'customize' ? 'bg-blue-500' : 'bg-gray-600'}`} />
              <div className={`w-2 h-2 rounded-full ${step === 'settings' ? 'bg-blue-500' : 'bg-gray-600'}`} />
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'template' && renderTemplateStep()}
          {step === 'customize' && renderCustomizeStep()}
          {step === 'settings' && renderSettingsStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="flex space-x-3">
            {step !== 'template' && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {step === 'settings' ? (
              <Button onClick={handleSubmit}>
                Create Board
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};