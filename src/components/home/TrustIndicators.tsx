"use client";

import { motion } from "framer-motion";
import { Grid, Badge, Icon } from "@/components/ui";

export default function TrustIndicators() {
  const testimonials = [
    {
      quote: "OptimaliQ helped us identify growth opportunities we never knew existed. Our revenue increased by 35% in just 6 months.",
      author: "Sarah Johnson",
      role: "CEO",
      company: "TechFlow Solutions",
      avatar: "/images/testimonials/avatar1.jpg"
    },
    {
      quote: "The AI insights are incredibly accurate. We've made better strategic decisions and outperformed our competitors consistently.",
      author: "Michael Chen",
      role: "VP of Strategy",
      company: "InnovateCorp",
      avatar: "/images/testimonials/avatar2.jpg"
    },
    {
      quote: "Finally, a platform that gives us real, actionable insights instead of just pretty charts. Game changer for our business.",
      author: "Emily Rodriguez",
      role: "Growth Director",
      company: "ScaleUp Ventures",
      avatar: "/images/testimonials/avatar3.jpg"
    }
  ];

  const stats = [
    { value: "500+", label: "Companies Trust OptimaliQ", icon: "shield" },
    { value: "35%", label: "Average Revenue Growth", icon: "trending-up" },
    { value: "98%", label: "Customer Satisfaction", icon: "target" },
    { value: "24/7", label: "AI-Powered Support", icon: "cpu" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <Grid.Container maxWidth="7xl">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Grid.Row cols={4} gap="lg">
            {stats.map((stat, index) => (
              <Grid.Col span={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Icon name={stat.icon} size="lg" className="text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid.Row>
        </motion.div>



        {/* Customer Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
              Trusted by leading companies worldwide
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-12 opacity-60">
            {/* Placeholder for customer logos */}
            <div className="flex items-center gap-8">
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-semibold">
                Company A
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-semibold">
                Company B
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-semibold">
                Company C
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-semibold">
                Company D
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-semibold">
                Company E
              </div>
            </div>
          </div>
        </motion.div>
      </Grid.Container>
    </section>
  );
} 