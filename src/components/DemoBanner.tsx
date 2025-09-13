// Demo banner component to show when user is in demo mode
import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Button } from './ui';

interface DemoBannerProps {
  onExitDemo?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onExitDemo }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm">
                Demo Mode Active
              </span>
              <span className="text-purple-100 text-xs">
                Exploring portfolio-ready sample data
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-purple-100 text-sm hidden sm:inline">
              Like what you see? Create your own account!
            </span>
            {onExitDemo && (
              <Button
                onClick={onExitDemo}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
