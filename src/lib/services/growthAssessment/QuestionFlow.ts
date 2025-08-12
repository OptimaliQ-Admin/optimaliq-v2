import { QuestionGroup } from '@/lib/services/onboarding/QuestionFlowManager';

// Growth Assessment chat flow for Step 2 only (lead is captured on Step 1 form with ReCAPTCHA)
export const growthAssessmentQuestionGroups: QuestionGroup[] = [
  {
    id: 'assessment',
    name: 'Growth Assessment',
    aiPromptIntro: 'Understanding your current situation to generate insights.',
    order: 1,
    transitionHook: 'Thanks! I will analyze your answers next.',
    questions: [
      { id: 'obstacles', type: 'text_area', prompt: 'What are your biggest obstacles to scaling?', required: true, maxCharacters: 250, rows: 4 },
      { id: 'strategy', type: 'text_area', prompt: 'How does your strategy differentiate you?', required: true, maxCharacters: 250, rows: 4 },
      { id: 'process', type: 'multiple_choice', prompt: 'Are your processes optimized for efficiency?', required: true, options: ['Yes','No'] },
      { id: 'customers', type: 'text_area', prompt: "How well do you understand your customers' needs?", required: true, maxCharacters: 250, rows: 4 },
      { id: 'technology', type: 'multiple_choice', prompt: 'Is your technology stack supporting your growth?', required: true, options: ['Outdated','Needs Work','Optimized','Cutting Edge'] },
    ]
  }
];


