//src/components/home/HowItWorks.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Assess & Identify",
    description: (
      <>
        We analyze your <strong>strategy, operations, and market position</strong> to uncover high-impact growth opportunities.  
        Our data-driven insights help you <strong>overcome obstacles, scale efficiently, and maximize ROI</strong>—tailored to your business challenges.
      </>
    ),
    image: "/images/Step1_Background.jpeg",
    icon: "📊",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
  },
  {
    id: 2,
    title: "Data-Driven Insights",
    description: (
      <>
        Harnessing <strong>machine learning across industries</strong>, we provide customized insights tailored to your business objectives.  
        Our models analyze real-world trends, market shifts, and operational data to help you <strong>identify opportunities, mitigate risks, and drive scalable growth.</strong>
      </>
    ),
    image: "/images/Real-Time_Insights.jpeg",
    icon: "🤖",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
  },
  {
    id: 3,
    title: "Implement & Scale",
    description: (
      <>
        <strong>Transform strategic insights into measurable success</strong> with custom recommendations designed to  
        <strong> enhance revenue, improve operational efficiency, and strengthen your competitive edge.</strong>
      </>
    ),
    image: "/images/Optimize_Scale.jpeg",
    icon: "🚀",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            How It Works
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Strategic Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our proven methodology combines AI-powered analysis with strategic execution to deliver measurable business impact.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map(({ id, title, description, image, icon, color, bgColor }, index) => (
            <motion.div 
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 z-20">
                <div className={`w-12 h-12 bg-gradient-to-r ${color} text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg`}>
                  {id}
                </div>
              </div>

              {/* Card */}
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden group-hover:shadow-2xl transition-all duration-500 h-full">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                    {icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed flex-grow">{description}</p>

                  {/* Bottom Accent */}
                  <div className={`mt-6 h-1 bg-gradient-to-r ${color} rounded-full`}></div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              </div>

              {/* Connection Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 z-10"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ready to Transform Your Strategy? */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden group-hover:shadow-2xl transition-all duration-500 h-full">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/Blog/Digital Transformation.jpeg"
                    alt="Digital Transformation"
                    fill
                    className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Strategy?</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed flex-grow mb-6">
                    Join thousands of businesses that have accelerated their growth with AI-powered strategic insights.
                  </p>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Free Assessment
                    </button>
                  </div>

                  {/* Bottom Accent */}
                  <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              </div>
            </motion.div>

            {/* You're Not Alone with OptimaliQ */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden group-hover:shadow-2xl transition-all duration-500 h-full">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/Blog/Modern Business Process Management.jpeg"
                    alt="Modern Business Process Management"
                    fill
                    className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">You're Not Alone with OptimaliQ</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    While our AI delivers fast, intelligent insights — real growth takes a human touch. That's why every OptimaliQ user can access real experts for strategic check-ins and support. It's the best of both worlds: AI-powered scale, human-backed care.
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-6 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
