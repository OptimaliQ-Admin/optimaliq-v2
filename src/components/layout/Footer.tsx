import Link from "next/link";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                <Link href="/features" className="text-gray-600 hover:text-blue-600 transition">
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
                <Link href="/data-security" className="text-gray-600 hover:text-blue-600 transition">
                  Data Security
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 hover:text-blue-600 transition">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-600 hover:text-blue-600 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Mailing Address Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mailing Address</h3>
            <p className="text-gray-600">
              PO Box 221<br />
              Dayton TN 37321
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} OptimaliQ. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
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
      </div>
    </footer>
  );
} 