/**
 * Page Navigation Component
 * Floating navigation that appears on scroll with enterprise-grade feel
 * Matches original GMF Plus v3.1 design
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Target, Shield, Settings, Sparkles, Trophy, Mail, HelpCircle } from 'lucide-react'

interface Section {
  id: string
  label: string
  icon: React.ReactNode
}

interface PageNavigationProps {
  sections: Section[]
  className?: string
}

export default function PageNavigation({ sections, className = "" }: PageNavigationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      // Show navigation after scrolling 1/3 of the viewport height
      setIsVisible(scrollPosition > windowHeight / 3)

      // Update active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }))

      let currentActive = ""
      for (const { id, element } of sectionElements) {
        if (element) {
          const rect = element.getBoundingClientRect()
          const offset = 100 // Offset for better detection
          
          if (rect.top <= offset && rect.bottom >= offset) {
            currentActive = id
          }
        }
      }
      
      setActiveSection(currentActive)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 120 // Account for fixed header
      const elementPosition = element.offsetTop - offset
      
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

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
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-2xl backdrop-blur-sm">
            {/* Navigation Items */}
            <div className="p-3 space-y-2">
              {/* Return to Top */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  activeSection === "" 
                    ? "bg-blue-100 text-blue-600 border-2 border-blue-200 shadow-lg" 
                    : "bg-gray-50/80 text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md"
                }`}
                title="Return to top"
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>

              {/* Section Navigation */}
              {sections.map(({ id, label, icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(id)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    activeSection === id 
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-200 shadow-lg" 
                      : "bg-gray-50/80 text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md"
                  }`}
                  title={label}
                >
                  <div className="text-lg">{icon}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
