import Link from "next/link";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { Grid, Badge, Icon } from "@/components/ui";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <Grid.Container maxWidth="7xl">
          <Grid.Row gap="xl" className="mb-12">
            {/* Logo and Tagline */}
            <Grid.Col span={3}>
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
                  <Badge variant="primary" size="sm" icon="shield">
                    Enterprise Ready
                  </Badge>
                  <Badge variant="secondary" size="sm" icon="cpu">
                    AI-Powered
                  </Badge>
                </div>
              </div>
            </Grid.Col>

            {/* Services Column */}
            <Grid.Col span={3}>
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Platform</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/growth-assessment" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="target" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      Growth Assessment
                    </Link>
                  </li>
                  <li>
                    <Link href="/#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="play" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/#key-features" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="star" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/Pricing" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="trending-up" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
            </Grid.Col>

            {/* Company Column */}
            <Grid.Col span={3}>
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Company</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="info" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="file-text" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      Terms of Use
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="shield" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/data-security" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                      <Icon name="lock" size="sm" className="text-blue-400 group-hover:scale-110 transition-transform" />
                      Data Security
                    </Link>
                  </li>
                </ul>
              </div>
            </Grid.Col>

            {/* Contact Column */}
            <Grid.Col span={3}>
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="mail" size="sm" className="text-blue-400" />
                    <a 
                      href="mailto:support@optimaliq.ai" 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                    >
                      support@optimaliq.ai
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="map-pin" size="sm" className="text-blue-400" />
                    <span className="text-gray-300">
                      PO Box 221<br />
                      Dayton TN 37321
                    </span>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <a 
                      href="https://linkedin.com/company/optimaliq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://twitter.com/optimaliq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </Grid.Col>
          </Grid.Row>

          {/* Bottom Section */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-300 text-center md:text-left">
                © {new Date().getFullYear()} <span className="text-white font-semibold">OptimaliQ</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-gray-400 text-sm text-center md:text-right">Made with ❤️ for growth-focused businesses</span>
              </div>
            </div>
          </div>
        </Grid.Container>
      </div>
    </footer>
  );
} 