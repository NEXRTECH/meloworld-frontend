"use client";
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface DashboardPanelProps {
  title: string;
  viewMoreLink?: string;
  children: ReactNode;
  className?: string;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ title, viewMoreLink, children, className }) => {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl shadow-lg p-6 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {viewMoreLink && (
          <Link href={viewMoreLink} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View More <FiArrowRight />
          </Link>
        )}
      </div>
      <div className="h-full">
        {children}
      </div>
    </motion.div>
  );
};