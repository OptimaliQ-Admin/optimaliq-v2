import Link from "next/link";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { StatusBadge } from "@/components/ui/data-display";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Tagline */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <div className="text-3xl font-bold text-white">
                OptimaliQ
              </div>
            </Link>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Transform your business with AI-powered strategic insights and real-time competitive intelligence.
            </p>
            <div className="flex items-center gap-4">
              <StatusBadge status="primary" size="sm">
                Enterprise Ready
              </StatusBadge>
              <StatusBadge status="info" size="sm">
                AI-Powered
              </StatusBadge>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/growth-assessment" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">🎯</span>
                  Growth Assessment
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">▶️</span>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#key-features" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">⭐</span>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">📈</span>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">ℹ️</span>
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">✓</span>
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">🛡️</span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">📞</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/demo" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">🎬</span>
                  Schedule Demo
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">🚀</span>
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">📝</span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">❓</span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 OptimaliQ. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://linkedin.com/company/optimaliq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/optimaliq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/optimaliq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
