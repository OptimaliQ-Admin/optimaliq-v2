"use client";

import { useState, useEffect } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import QuadrantChart from './QuadrantChart';
import { BarChartCard } from './BarChartCard';
import { motion } from "framer-motion";

interface CompanyData {
  label: string;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
}

interface UserData {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
}

interface QuadrantData {
  companies: CompanyData[];
  user: UserData;
}

export const GrowthChartModule = () => {
  const { user } = usePremiumUser();
  const [data, setData] = useState<QuadrantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.u_id) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/growth_studio/quadrant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ u_id: user.u_id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quadrant data');
        }

        const quadrantData = await response.json();
        setData(quadrantData);
      } catch (err) {
        console.error('Error fetching quadrant data:', err);
        setError('Failed to load growth data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.u_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <QuadrantChart 
        companies={data.companies}
        userData={data.user}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
      <BarChartCard 
        companies={data.companies}
        userData={data.user}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
    </motion.div>
  );
}; 