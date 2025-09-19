import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    })),
  },
  supabaseService: {
    getUser: jest.fn(),
    updateUser: jest.fn(),
    createAssessment: jest.fn(),
    getAssessment: jest.fn(),
    getUserAssessments: jest.fn(),
    getDashboardInsights: jest.fn(),
    createDashboardInsights: jest.fn(),
    getGrowthLevers: jest.fn(),
    createGrowthLevers: jest.fn(),
    getTeamMembers: jest.fn(),
    inviteTeamMember: jest.fn(),
    getMarketSnapshots: jest.fn(),
    searchMarketArticles: jest.fn(),
  },
  auth: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
}));

// Mock AI Router
jest.mock('@/lib/ai-router', () => ({
  aiRouter: {
    execute: jest.fn(),
    getProviderStatus: jest.fn(),
    getCostTracking: jest.fn(),
    resetCostTracking: jest.fn(),
  },
  ai: {
    generate: jest.fn(),
    embed: jest.fn(),
    classify: jest.fn(),
    summarize: jest.fn(),
    analyze: jest.fn(),
  },
  AITask: {
    TEXT_GENERATION: 'text_generation',
    EMBEDDINGS: 'embeddings',
    CLASSIFICATION: 'classification',
    SUMMARIZATION: 'summarization',
    TRANSLATION: 'translation',
    REASONING: 'reasoning',
    CREATIVE: 'creative',
    ANALYSIS: 'analysis',
  },
  AIProvider: {
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    GOOGLE: 'google',
    MISTRAL: 'mistral',
  },
}));

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    elements: jest.fn(() => ({
      create: jest.fn(() => ({
        mount: jest.fn(),
        unmount: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
      })),
    })),
    confirmPayment: jest.fn(),
    confirmCardPayment: jest.fn(),
    createToken: jest.fn(),
    createSource: jest.fn(),
  })),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    ul: 'ul',
    ol: 'ol',
    li: 'li',
    a: 'a',
    img: 'img',
    svg: 'svg',
    path: 'path',
    circle: 'circle',
    rect: 'rect',
    line: 'line',
    polygon: 'polygon',
    g: 'g',
    defs: 'defs',
    clipPath: 'clipPath',
    linearGradient: 'linearGradient',
    stop: 'stop',
    radialGradient: 'radialGradient',
    feGaussianBlur: 'feGaussianBlur',
    feOffset: 'feOffset',
    feMerge: 'feMerge',
    feMergeNode: 'feMergeNode',
    feComposite: 'feComposite',
    feBlend: 'feBlend',
    feColorMatrix: 'feColorMatrix',
    feFuncR: 'feFuncR',
    feFuncG: 'feFuncG',
    feFuncB: 'feFuncB',
    feFuncA: 'feFuncA',
    feConvolveMatrix: 'feConvolveMatrix',
    feDisplacementMap: 'feDisplacementMap',
    feFlood: 'feFlood',
    feImage: 'feImage',
    feMorphology: 'feMorphology',
    feSpecularLighting: 'feSpecularLighting',
    feDistantLight: 'feDistantLight',
    fePointLight: 'fePointLight',
    feSpotLight: 'feSpotLight',
    feTile: 'feTile',
    feTurbulence: 'feTurbulence',
    feDiffuseLighting: 'feDiffuseLighting',
    feComponentTransfer: 'feComponentTransfer',
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useTransform: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useSpring: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useMotionValueEvent: jest.fn(),
  LazyMotion: ({ children }) => children,
  domAnimation: {},
}));

// Mock Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ children }) => <div data-testid="line">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }) => <div data-testid="bar">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  RadarChart: ({ children }) => <div data-testid="radar-chart">{children}</div>,
  Radar: ({ children }) => <div data-testid="radar">{children}</div>,
  XAxis: ({ children }) => <div data-testid="x-axis">{children}</div>,
  YAxis: ({ children }) => <div data-testid="y-axis">{children}</div>,
  CartesianGrid: ({ children }) => <div data-testid="cartesian-grid">{children}</div>,
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
  Legend: ({ children }) => <div data-testid="legend">{children}</div>,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock React Hook Form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {}, isSubmitting: false },
    watch: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    reset: jest.fn(),
    control: {},
  })),
  Controller: ({ render }) => render({ field: {}, fieldState: {} }),
}));

// Mock React Hot Toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Mock Intersection Observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock window.URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
  writable: true,
});

// Mock window.URL.revokeObjectURL
Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true,
});

// Console error suppression for known warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
