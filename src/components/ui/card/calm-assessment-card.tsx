"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "../button/button";
import { Course } from "@/components/types";
import { FiArrowRight } from "react-icons/fi";

export const AliveAssessmentCard: React.FC<{ assessment: Course }> = ({ assessment }) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // Create motion values to track mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Create transforms to map mouse position to 3D rotation
  const rotateX = useTransform(y, [-150, 150], [10, -10]); // A 10-degree rotation
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Update motion values with mouse position relative to card center
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    // Reset position on mouse leave
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ perspective: "800px" }} // Add perspective for 3D effect
      className="w-full max-w-sm"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }} // Apply the 3D rotation here
        whileHover={{ scale: 1.05 }} // Scale up on hover
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative cursor-pointer rounded-3xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm"
      >
        {/* The rest of the card content remains the same */}
        <div className="flex flex-col h-full rounded-3xl overflow-hidden">
          <div className="relative w-full aspect-video">
            <img
              src={assessment.image || '/placeholder-image.png'}
              alt={assessment.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold">{assessment.title}</h3>
            <p className="mt-2 text-base flex-grow opacity-70">{assessment.description}</p>
            <Button
              size="sm"
              onClick={() => router.push(`/candidate/course/${assessment._id}`)}
              className="mt-6 w-full"
            >
              View More
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};