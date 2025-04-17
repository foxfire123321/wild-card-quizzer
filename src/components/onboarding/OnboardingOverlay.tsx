
import React, { useState, useEffect } from "react";
import { HelpCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TooltipInfo {
  id: string;
  title: string;
  content: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
  };
  arrowPosition: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
  };
}

interface OnboardingOverlayProps {
  tooltips: TooltipInfo[];
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ tooltips, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if user has seen this onboarding before
  useEffect(() => {
    const hasSeenKey = `onboarding_seen_${window.location.pathname}`;
    const hasSeen = localStorage.getItem(hasSeenKey);
    if (!hasSeen) {
      // Only auto-show on first visit
      localStorage.setItem(hasSeenKey, 'true');
    }
  }, []);

  const openOverlay = () => {
    setIsOpen(true);
    setCurrentTooltipIndex(0);
  };

  const closeOverlay = () => {
    setIsOpen(false);
    onComplete();
  };

  const nextTooltip = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentTooltipIndex < tooltips.length - 1) {
        setCurrentTooltipIndex(prevIndex => prevIndex + 1);
      } else {
        closeOverlay();
      }
      setIsAnimating(false);
    }, 300);
  };

  const currentTooltip = tooltips[currentTooltipIndex];

  return (
    <>
      {/* Help button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={openOverlay} 
          variant="ghost" 
          size="icon"
          className="rounded-full h-8 w-8 bg-amber-400/90 text-black hover:bg-amber-500"
        >
          <HelpCircle size={18} />
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          {/* Close button */}
          <Button
            onClick={closeOverlay}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </Button>

          {/* Current tooltip */}
          <div 
            className={`absolute transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            style={currentTooltip.position}
          >
            {/* Arrow */}
            <div 
              className="absolute w-10 h-10 text-amber-400"
              style={currentTooltip.arrowPosition}
            >
              <ArrowRight 
                size={40} 
                className="animate-pulse"
              />
            </div>

            {/* Tooltip box */}
            <div className="bg-amber-400 text-black rounded-lg p-4 max-w-xs shadow-lg">
              <h3 className="font-bold text-lg mb-1">{currentTooltip.title}</h3>
              <p>{currentTooltip.content}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm font-medium">
                  {currentTooltipIndex + 1} / {tooltips.length}
                </span>
                <Button
                  onClick={nextTooltip}
                  className="bg-white text-amber-500 hover:bg-gray-100"
                >
                  {currentTooltipIndex < tooltips.length - 1 ? 'Next' : 'Got It!'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingOverlay;
