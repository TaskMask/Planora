import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const GRADIENT_PRESETS = [
  {
    name: 'Ocean Blue',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
  },
  {
    name: 'Sunset',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: 'bg-gradient-to-br from-pink-400 to-red-500'
  },
  {
    name: 'Forest',
    value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    preview: 'bg-gradient-to-br from-green-400 to-teal-400'
  },
  {
    name: 'Golden Hour',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    preview: 'bg-gradient-to-br from-pink-400 to-yellow-400'
  },
  {
    name: 'Arctic',
    value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    preview: 'bg-gradient-to-br from-blue-400 to-cyan-400'
  },
  {
    name: 'Lavender',
    value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: 'bg-gradient-to-br from-teal-200 to-pink-200'
  },
  {
    name: 'Electric',
    value: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    preview: 'bg-gradient-to-br from-purple-300 to-yellow-100'
  },
  {
    name: 'Cosmic',
    value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    preview: 'bg-gradient-to-br from-cyan-300 to-blue-500'
  },
  {
    name: 'Fire',
    value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    preview: 'bg-gradient-to-br from-red-300 to-pink-200'
  },
  {
    name: 'Midnight',
    value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    preview: 'bg-gradient-to-br from-gray-700 to-blue-500'
  },
  {
    name: 'Royal',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  },
  {
    name: 'Emerald',
    value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    preview: 'bg-gradient-to-br from-teal-600 to-green-400'
  }
];

const SOLID_COLORS = [
  { name: 'Crimson', value: '#dc2626', preview: 'bg-red-600' },
  { name: 'Orange', value: '#ea580c', preview: 'bg-orange-600' },
  { name: 'Amber', value: '#d97706', preview: 'bg-amber-600' },
  { name: 'Emerald', value: '#059669', preview: 'bg-emerald-600' },
  { name: 'Teal', value: '#0d9488', preview: 'bg-teal-600' },
  { name: 'Sky', value: '#0284c7', preview: 'bg-sky-600' },
  { name: 'Indigo', value: '#4f46e5', preview: 'bg-indigo-600' },
  { name: 'Purple', value: '#7c3aed', preview: 'bg-purple-600' },
  { name: 'Pink', value: '#db2777', preview: 'bg-pink-600' },
  { name: 'Rose', value: '#e11d48', preview: 'bg-rose-600' },
  { name: 'Slate', value: '#475569', preview: 'bg-slate-600' },
  { name: 'Gray', value: '#6b7280', preview: 'bg-gray-600' }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gradients' | 'solids'>('gradients');

  const currentPreview = GRADIENT_PRESETS.find(p => p.value === value) || 
                        SOLID_COLORS.find(p => p.value === value);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* Color Preview Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 relative overflow-hidden glass-dark"
        style={value.includes('gradient') ? { backgroundImage: value } : { backgroundColor: value }}
      >
        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white font-medium drop-shadow-lg">
            {currentPreview?.name || 'Custom Color'}
          </span>
        </div>
      </motion.button>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-full mt-4 left-0 right-0 glass-dark rounded-3xl border border-white/20 shadow-2xl z-50 p-6 max-h-96 overflow-y-auto"
            >
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-white/5 rounded-2xl p-1">
                <button
                  onClick={() => setActiveTab('gradients')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'gradients'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ✨ Gradients
                </button>
                <button
                  onClick={() => setActiveTab('solids')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'solids'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🎨 Solid Colors
                </button>
              </div>

              {/* Color Grid */}
              <div className="grid grid-cols-3 gap-3">
                {(activeTab === 'gradients' ? GRADIENT_PRESETS : SOLID_COLORS).map((color, index) => (
                  <motion.button
                    key={color.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onChange(color.value);
                      setIsOpen(false);
                    }}
                    className={`aspect-square rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                      value === color.value 
                        ? 'border-white/60 shadow-lg' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    style={
                      activeTab === 'gradients' 
                        ? { backgroundImage: color.value } 
                        : { backgroundColor: color.value }
                    }
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-end p-2">
                      <span className="text-white text-xs font-medium drop-shadow-lg">
                        {color.name}
                      </span>
                    </div>
                    {value === color.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-sm">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
