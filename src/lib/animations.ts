// Animation system for enterprise-grade interactions
export const animations = {
  // Basic animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Interactive animations
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  tap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeOut" }
  },

  buttonHover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  buttonTap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeOut" }
  },

  // Card animations
  cardHover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  },

  cardTap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeOut" }
  },

  // List animations
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },

  staggerFast: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  },

  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: "easeInOut" }
  },

  pageSlide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },

  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Loading animations
  loadingPulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  loadingSpin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // Progress animations
  progressFill: {
    initial: { width: 0 },
    animate: { width: "100%" },
    transition: { duration: 0.8, ease: "easeOut" }
  },

  // Chart animations
  chartBar: {
    initial: { height: 0 },
    animate: { height: "100%" },
    transition: { duration: 0.6, ease: "easeOut" }
  },

  chartLine: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1, ease: "easeOut" }
  },

  // Notification animations
  notificationSlide: {
    initial: { opacity: 0, x: 300 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  notificationPop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Form animations
  formField: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  formError: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Success animations
  successCheck: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      duration: 0.3, 
      ease: "easeOut",
      type: "spring",
      stiffness: 200
    }
  },

  // Error animations
  errorShake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  },

  // Focus animations
  focusRing: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Reduced motion support
  reducedMotion: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1 }
  }
};

// Animation variants for complex components
export const animationVariants = {
  // Dashboard grid
  dashboardGrid: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  dashboardCard: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },

  // Assessment flow
  assessmentFlow: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  },

  // Question options
  questionOptions: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  questionOption: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },

  // Navigation
  navigation: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },

  // Sidebar
  sidebar: {
    hidden: { x: -300 },
    visible: { x: 0 },
    exit: { x: -300 }
  },

  // Dropdown
  dropdown: {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  },

  // Tooltip
  tooltip: {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 }
  }
};

// Performance-optimized animations
export const performanceAnimations = {
  // Use transform instead of layout properties
  transformOnly: {
    initial: { transform: "translateY(20px) scale(0.95)" },
    animate: { transform: "translateY(0px) scale(1)" },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Hardware-accelerated animations
  hardwareAccelerated: {
    initial: { transform: "translate3d(0, 20px, 0)" },
    animate: { transform: "translate3d(0, 0, 0)" },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Reduced motion for accessibility
  accessible: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1 }
  }
};

// Animation utilities
export const animationUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  // Get appropriate animation based on user preference
  getAccessibleAnimation: (animation: any) => {
    if (animationUtils.prefersReducedMotion()) {
      return performanceAnimations.accessible;
    }
    return animation;
  },

  // Debounce animation to prevent excessive re-renders
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle animation for performance
  throttle: (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Export default animation configuration
export default {
  animations,
  animationVariants,
  performanceAnimations,
  animationUtils
}; 