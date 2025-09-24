import React, { useState, useEffect, useMemo, useRef } from 'react';
import { playClickSound } from '../utils/uiUtils';

interface OnboardingTourProps {
  step: number;
  onNext: () => void;
  onEnd: () => void;
}

const tourSteps = [
  {
    title: 'Welcome to Perle Clausecraft!',
    content: 'This quick tour will guide you through the main features. You can skip at any time.',
    targetId: null, // Centered modal
  },
  {
    title: 'The Control Bar',
    content: 'This is your command center. Select the type of document you want to create and configure the AI model here.',
    targetId: 'control-bar',
    position: 'bottom',
  },
  {
    title: 'Generate Documents',
    content: 'Click here to generate a new document. You can also create new versions of existing documents or finalize them.',
    targetId: 'generate-button',
    position: 'bottom',
  },
  {
    title: 'Document History',
    content: 'All your generated documents and their versions are organized here. You can easily switch between them.',
    targetId: 'sidebar',
    position: 'right',
  },
  {
    title: 'Main Display',
    content: 'Your generated contracts, letters, and agreements will be displayed in this area for review and editing.',
    targetId: 'content-area',
    position: 'top',
  },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ step, onNext, onEnd }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0, pointerEvents: 'none' });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepConfig = useMemo(() => tourSteps[step] || null, [step]);

  useEffect(() => {
    if (!currentStepConfig) return;

    // This function calculates and applies the final, screen-aware position.
    const calculateAndSetPosition = () => {
      const tooltipElement = tooltipRef.current;
      if (!tooltipElement) return; // Wait for the tooltip to be rendered.

      const targetElement = currentStepConfig.targetId
        ? document.querySelector(`[data-tour-id="${currentStepConfig.targetId}"]`)
        : null;
      
      const currentTargetRect = targetElement ? targetElement.getBoundingClientRect() : null;
      setTargetRect(currentTargetRect);

      const PADDING = 16; // Space from viewport edges
      const tooltipRect = tooltipElement.getBoundingClientRect(); // Get actual tooltip size
      let finalStyle: React.CSSProperties = {};

      if (currentTargetRect) {
        const { top, left, width, height } = currentTargetRect;
        const offset = 12;

        let desiredTop = 0;
        let desiredLeft = 0;

        // Calculate ideal position based on config
        switch (currentStepConfig.position) {
          case 'bottom':
            desiredTop = top + height + offset;
            desiredLeft = left + width / 2 - tooltipRect.width / 2;
            break;
          case 'right':
            desiredTop = top;
            desiredLeft = left + width + offset;
            break;
          case 'top':
            desiredTop = top - tooltipRect.height - offset;
            desiredLeft = left + width / 2 - tooltipRect.width / 2;
            break;
          default:
            desiredTop = top;
            desiredLeft = left;
        }

        // --- Viewport Collision Detection & Correction ---
        // Horizontal correction
        if (desiredLeft < PADDING) {
          desiredLeft = PADDING;
        } else if (desiredLeft + tooltipRect.width > window.innerWidth - PADDING) {
          desiredLeft = window.innerWidth - tooltipRect.width - PADDING;
        }

        // Vertical correction
        if (desiredTop < PADDING) {
          desiredTop = PADDING;
        } else if (desiredTop + tooltipRect.height > window.innerHeight - PADDING) {
          desiredTop = window.innerHeight - tooltipRect.height - PADDING;
        }
        
        finalStyle = {
          top: `${desiredTop}px`,
          left: `${desiredLeft}px`,
          transform: 'none',
        };
      } else {
        // Centered modal
        finalStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      }

      setTooltipStyle({ ...finalStyle, opacity: 1, pointerEvents: 'auto' });
      setIsVisible(true);
    };

    // On step change, hide everything first to prevent flicker
    setIsVisible(false);
    setTargetRect(null);
    setTooltipStyle({ opacity: 0, pointerEvents: 'none' });

    // Delay calculation to allow DOM to update and ref to be available
    const timer = setTimeout(calculateAndSetPosition, 150);

    return () => clearTimeout(timer);
  }, [step, currentStepConfig]);

  if (!currentStepConfig) {
    return null;
  }

  const handleNext = () => {
    playClickSound();
    if (step === tourSteps.length - 1) {
      onEnd();
    } else {
      onNext();
    }
  };

  const handleSkip = () => {
    playClickSound();
    onEnd();
  };

  const tooltipClasses = [
    'fixed', // Use fixed instead of absolute for viewport-relative positioning
    'hud-panel', 'p-4', 'w-72', 'max-w-xs', 'text-sm', 'z-[60]', 
    'transition-opacity', 'duration-300', 'ease-in-out',
    'animate-fade-in-up'
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleSkip}
      />
      
      {targetRect && (
        <div
          className="fixed border-2 border-[var(--accent-color)] rounded-md shadow-2xl shadow-[var(--accent-color)]/50 z-50 pointer-events-none transition-all duration-300 ease-in-out"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            opacity: isVisible ? 1 : 0,
          }}
        />
      )}

      <div ref={tooltipRef} className={tooltipClasses.join(' ')} style={tooltipStyle}>
        <div className="corner-bottom-left"></div>
        <div className="corner-bottom-right"></div>
        <h3 className="text-lg font-bold text-[var(--accent-color)] mb-2">{currentStepConfig.title}</h3>
        <p className="text-gray-300 leading-relaxed">{currentStepConfig.content}</p>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleSkip}
            className="btn-secondary-animated text-xs font-semibold py-1.5 px-3"
          >
            Skip Tour
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{`${step + 1} / ${tourSteps.length}`}</span>
            <button
              onClick={handleNext}
              className="btn-animated bg-[var(--accent-color)] text-black font-semibold text-sm py-2 px-4"
            >
              {step === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
