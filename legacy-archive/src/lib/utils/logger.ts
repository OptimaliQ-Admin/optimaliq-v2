// Universal logger utility for assessment flows
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  section: string;
  data?: any;
  error?: any;
  level?: LogLevel;
}

const LOG_PREFIX = '[GMF Assessment]';

export const logAssessment = ({ section, data, error, level = 'info' }: LogData) => {
  const timestamp = new Date().toISOString();
  const prefix = `${LOG_PREFIX} [${timestamp}] [${section}]`;

  switch (level) {
    case 'error':
      console.error(prefix, error || data);
      break;
    case 'warn':
      console.warn(prefix, data);
      break;
    case 'debug':
      console.debug(prefix, data);
      break;
    default:
      console.log(prefix, data);
  }
};

// Convenience functions for common logging patterns
export const logAssessmentInput = (section: string, data: any) => {
  logAssessment({
    section,
    data: {
      type: 'input',
      ...data
    },
    level: 'info'
  });
};

export const logAssessmentScore = (section: string, data: any) => {
  logAssessment({
    section,
    data: {
      type: 'score',
      ...data
    },
    level: 'info'
  });
};

export const logAssessmentError = (section: string, error: any) => {
  logAssessment({
    section,
    error,
    level: 'error'
  });
};

export const logAssessmentDebug = (section: string, data: any) => {
  logAssessment({
    section,
    data,
    level: 'debug'
  });
}; 