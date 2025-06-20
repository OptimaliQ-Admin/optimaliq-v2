"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface PageNavigationProps {
  sections: Section[];
  className?: string;
}

export default function PageNavigation({ sections, className = "" }: PageNavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show navigation after scrolling 1/3 of the viewport height
      setIsVisible(scrollPosition > windowHeight / 3);

      // Update active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      let currentActive = "";
      for (const { id, element } of sectionElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = 100; // Offset for better detection
          
          if (rect.top <= offset && rect.bottom >= offset) {
            currentActive = id;
          }
        }
      }
      
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-40 ${className}`}
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg backdrop-blur-sm">
            {/* Navigation Items */}
            <div className="p-3 space-y-2">
              {/* Return to Top */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeSection === "" 
                    ? "bg-blue-100 text-blue-600 border-2 border-blue-200" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
                title="Return to top"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </motion.button>

              {/* Section Navigation */}
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative group ${
                    activeSection === section.id 
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-200" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  title={section.label}
                >
                  <span className="text-lg">{section.icon}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {section.label}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="px-3 pb-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 