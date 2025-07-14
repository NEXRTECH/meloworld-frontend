"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// The new "alive" card component
import { AliveAssessmentCard } from "@/components/ui/card/calm-assessment-card";

// ASSETS, STORES, and UI
import homeImg from "@/assets/candidate-home-illustration.png";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCandidateStore } from "@/components/stores/candidate-store";
import Button from "@/components/ui/button/button";
import { FiActivity, FiClipboard } from "react-icons/fi";

const CandidateHome: React.FC = () => {
  const { token } = useAuthStore();
  const { getAssessments, assessments } = useCandidateStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const assessmentsSectionRef = useRef<HTMLDivElement>(null);
  
  const [carouselWidth, setCarouselWidth] = useState(0);

  // --- Scroll Animation Logic for "Curtain Reveal" ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  // As we scroll the first 40% of the container, move the hero section up
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "-80%"]);

  // --- Component Effects ---
  useEffect(() => {
    if (token) {
      getAssessments(token);
    }
  }, [token, getAssessments]);

  // Measure the width of the carousel for drag constraints once assessments load
  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const offsetWidth = carouselRef.current.offsetWidth;
      setCarouselWidth(scrollWidth - offsetWidth);
    }
  }, [assessments]);

  const scrollToAssessments = () => {
    assessmentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Animation Variants ---
  const sentence = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-gray-200 py-5 overflow-x-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-24 w-96 h-96 bg-amber-200/40 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-24 -right-24 w-96 h-96 bg-sky-200/40 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div style={{ y: heroY }} className="relative">
        <div className="absolute top-0 left-0 w-full h-[50rem] sm:h-[60rem] overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-4/5 bg-gray-100 rounded-t-full"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-3/5 bg-white rounded-t-full shadow-md border-t"></div>
        </div>
        
        <div className="relative z-10 pt-20 pb-24 sm:pt-24 sm:pb-32 px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-7xl mx-auto">
            <div className="flex flex-col gap-5 text-center lg:text-left">
              <motion.h1
                variants={sentence}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-6xl font-medium"
              >
                {"Choose an assessment".split(" ").map((word, index) => (
                  <span key={index} className="inline-block">
                    {word.split("").map((char, i) => (
                      <motion.span key={i} variants={letter} className="inline-block">{char}</motion.span>
                    ))}
                    &nbsp;
                  </span>
                ))}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-lg md:text-xl opacity-70"
              >
                Discover yourself through assessments tailored to your personality,
                career aptitude, and emotional intelligence.
              </motion.p>
              <div className="mt-4 flex justify-center lg:justify-start">
                <Button size="sm" onClick={scrollToAssessments}>Show Assessments</Button>
              </div>
            </div>

            <div className="relative flex justify-center mt-8 lg:mt-0">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img className="w-full max-w-md sm:max-w-lg" src={homeImg.src} alt="A person sitting calmly" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
                className="absolute top-4 left-4 lg:left-0 flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border"
              >
                <div className="p-2 bg-amber-100 rounded-full"><FiActivity className="text-amber-600" /></div>
                <div><p className="text-sm font-bold">Today's Focus</p><p className="text-xs opacity-60">Mindfulness</p></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.7, ease: "easeOut" }}
                className="absolute bottom-4 right-4 lg:right-0 flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border"
              >
                <div className="p-2 bg-sky-100 rounded-full"><FiClipboard className="text-sky-600" /></div>
                <div><p className="text-sm font-bold">Your Progress</p><p className="text-xs opacity-60">1 of 5 completed</p></div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div ref={assessmentsSectionRef} className="relative z-0 bg-gray-50 pt-16 sm:pt-24 pb-24 px-0">
        <div className="text-center mb-16 max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold">Begin Your Journey</h2>
          <p className="mt-4 text-lg opacity-70">Each path offers insights into your unique strengths. Drag the cards to explore.</p>
        </div>
        
        <motion.div ref={carouselRef} className="cursor-grab w-full">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -carouselWidth }}
            whileTap={{ cursor: "grabbing" }}
            className="flex gap-10 px-6 lg:px-8"
          >
            {assessments.map((assessment) => (
              <div key={assessment._id} className="min-w-[80vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[28vw]">
                <AliveAssessmentCard assessment={assessment} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CandidateHome;
