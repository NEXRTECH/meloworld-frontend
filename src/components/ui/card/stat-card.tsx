"use client";
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  stat: number;
  icon: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, stat, icon }) => {
    return (
        <motion.div 
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            className="relative bg-white border border-gray-200 rounded-2xl p-5 w-full cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    {React.cloneElement(icon as React.ReactElement, { className: "text-2xl" })}
                </div>
                {/* Placeholder for a micro-chart */}
                <div className="w-12 h-8 bg-gray-100 rounded-md"></div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold">{stat.toLocaleString()}</p>
                <p className="text-sm opacity-60 mt-1">{title}</p>
            </div>
        </motion.div>
    );
};