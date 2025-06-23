import Link from "next/link";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              OptimaliQ
            </Link>
            <p className="text-gray-600">
              Smarter decisions, faster growth with real-time AI insights.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/growth-assessment" className="text-gray-600 hover:text-blue-600 transition">
                  Growth Assessment
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-600 hover:text-blue-600 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#key-features" className="text-gray-600 hover:text-blue-600 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/Pricing" className="text-gray-600 hover:text-blue-600 transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-600 hover:text-blue-600 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-600 mb-2 text-center">
            123 Innovation Drive, Suite 456, San Francisco, CA 94107
          </p>
          <p className="text-gray-600 mb-4 text-center">
            © {new Date().getFullYear()} OptimaliQ. All rights reserved.
          </p>
          <div className="flex justify-center items-center space-x-6">
            <a 
              href="https://linkedin.com/company/optimaliq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:support@optimaliq.ai" 
              className="text-blue-600 hover:text-blue-700 transition"
            >
              support@optimaliq.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 