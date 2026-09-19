import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  PlayCircle,
  Database,
  SlidersHorizontal,
  BarChart3,
  ShieldAlert,
  Sliders,
  Award
} from 'lucide-react';

export default function DemoGuideModal({ isOpen, onClose, currentStep, setCurrentStep, onActionStep }) {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Step 1: Load Demo Dataset',
      icon: Database,
      desc: 'Load the pre-configured synthetic hiring evaluation dataset (50 candidate profiles with intentional gender and age disparities).',
      actionLabel: 'Load Dataset & Proceed',
      tab: 'dashboard',
    },
    {
      step: 2,
      title: 'Step 2: Configure Audit Parameters',
      icon: SlidersHorizontal,
      desc: 'Set the target outcome column (e.g. "selected"), protected demographic group (e.g. "gender"), and positive outcome value ("1").',
      actionLabel: 'Run Statistical Audit',
      tab: 'dashboard',
    },
    {
      step: 3,
      title: 'Step 3: Detect Algorithmic Disparities',
      icon: BarChart3,
      desc: 'Review the empirical calculations: Disparate Impact Ratio (45%), Statistical Parity (-47%), False Positive & False Negative Rates per group.',
      actionLabel: 'Inspect Heatmap & Charts',
      tab: 'heatmap',
    },
    {
      step: 4,
      title: 'Step 4: Investigate Root Causes',
      icon: ShieldAlert,
      desc: 'Explore automated algorithmic findings with transparent, plain-English AI explanations explaining why each disparity was flagged.',
      actionLabel: 'View Bias Findings',
      tab: 'findings',
    },
    {
      step: 5,
      title: 'Step 5: Simulate Mitigation in Real-Time',
      icon: Sliders,
      desc: 'Apply Equalized Odds threshold calibration to observe live before vs after outcome equalization (+28% fairness score improvement).',
      actionLabel: 'Run Mitigation Simulator',
      tab: 'simulator',
    },
    {
      step: 6,
      title: 'Step 6: Submit Bias Bounty Ticket',
      icon: Award,
      desc: 'Package the discovered vulnerability into a formal Bias Bounty Report ticket with evidence, impact assessment, and remediation roadmap.',
      actionLabel: 'Generate Bounty Report',
      tab: 'bounty',
    },
  ];

  const current = steps[currentStep - 1] || steps[0];
  const Icon = current.icon;

  const handleNext = () => {
    onActionStep(current.step, current.tab);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-brand-teal/40 bg-gradient-to-b from-navy-900 via-navy-850 to-navy-950 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-brand-cyan text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Presentation Flow ({currentStep} of {steps.length})</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Innov8 4.0 Demo</span>
        </div>

        {/* Step Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-teal flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-teal/20">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{current.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-brand-blue to-brand-teal h-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2"
            >
              Exit Tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-lg shadow-brand-teal/25 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
