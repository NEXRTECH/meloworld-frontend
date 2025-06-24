"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import logoTransparent from "@/assets/logo-transparent.png";
import { IoLogOut } from "react-icons/io5";
import { TbMenu2, TbPinnedFilled, TbPinned } from "react-icons/tb";

import { useAuthStore } from "../stores/auth-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog/dialog";
import Button from "./button/button";

interface MenuItem {
  title: string;
  to: string;
  icon: ReactNode;
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
  title: string;
}

const NavItem: React.FC<{ item: MenuItem; isExpanded: boolean; pathname: string; }> = ({ item, isExpanded, pathname }) => {
    const isActive = pathname.startsWith(item.to);
    return (
        <div className="relative w-full">
            <Link href={item.to} className={`flex items-center gap-4 w-full h-12 px-4 rounded-lg transition-colors duration-200 ${isActive ? 'bg-primary/10' : 'hover:bg-gray-100'}`}>
                <span className={`text-2xl ${isActive ? 'text-primary' : 'text-sky-900'}`}>{item.icon}</span>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className=" whitespace-nowrap"
                        >
                            {item.title}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
            {isActive && <motion.div layoutId="active-indicator" className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full" />}
            {!isExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.title}
                </div>
            )}
        </div>
    );
};


const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ menuItems = [], title }) => {
  const { clearAuth } = useAuthStore();
  const pathname = usePathname();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = () => !isPinned && setIsExpanded(true);
  const handleMouseLeave = () => !isPinned && setIsExpanded(false);
  const handlePinToggle = () => {
    setIsPinned(!isPinned);
    if (!isPinned) setIsExpanded(true);
  };
  
  // You might want to adapt the logout logic to fit the new structure
  const handleLogout = () => {
    clearAuth();
    // Potentially redirect here
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? "16rem" : "5rem" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-secondary border-r border-gray-200 p-4 shadow-sm z-40"
      >
        <div className="flex items-center gap-2 mb-8 px-2">
            <Image src={logoTransparent} alt="Logo" width={40} height={40} />
            <AnimatePresence>
                {isExpanded && (
                    <motion.h2 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="font-bold text-lg whitespace-nowrap"
                    >
                        {title} Portal
                    </motion.h2>
                )}
            </AnimatePresence>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
            {menuItems.map((item) => (
                <div key={item.title} className="group relative">
                    <NavItem item={item} isExpanded={isExpanded} pathname={pathname} />
                </div>
            ))}
        </nav>

        <div className="flex flex-col gap-2">
            <div className="group relative">
                <div onClick={() => clearAuth()} className="flex items-center gap-4 w-full h-12 px-4 rounded-lg cursor-pointer hover:bg-gray-100">
                    <IoLogOut className="text-2xl text-sky-900" />
                    <AnimatePresence>{isExpanded && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className=" whitespace-nowrap">Logout</motion.span>}</AnimatePresence>
                </div>
                {!isExpanded && <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Logout</div>}
            </div>

            <button onClick={handlePinToggle} className="flex items-center gap-4 w-full h-12 px-4 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-2xl text-sky-900">{isPinned ? <TbPinnedFilled/> : <TbPinned/>}</span>
                <AnimatePresence>{isExpanded && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className=" whitespace-nowrap">{isPinned ? 'Unpin' : 'Pin'}</motion.span>}</AnimatePresence>
            </button>
        </div>
      </motion.aside>

      {/* --- MOBILE HEADER & MENU --- */}
      <header className="lg:hidden fixed top-0 w-full bg-white backdrop-blur-md border-b z-30 flex items-center justify-between px-4 h-16">
        <Image src={logoTransparent} alt="Logo" width={32} height={32} />
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
            <TbMenu2 size={24} />
        </button>
      </header>
       <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden fixed inset-0 w-3/4 h-screen bg-secondary border-r z-50 p-4 flex flex-col"
            >
                 <div className="flex items-center justify-between mb-8">
                     <h2 className="font-bold text-lg">{title} Portal</h2>
                     <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><IoLogOut size={24} /></button>
                 </div>
                 <nav className="flex-1 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link href={item.to} key={item.title} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-3 rounded-lg ${pathname.startsWith(item.to) ? 'bg-primary/10 text-primary' : ''}`}>
                            <span className="text-2xl">{item.icon}</span>
                            <span className="">{item.title}</span>
                        </Link>
                    ))}
                 </nav>
                 <Button variant="outline" onClick={handleLogout} className="w-full">Logout</Button>
            </motion.div>
        )}
       </AnimatePresence>
       {/* Backdrop for mobile menu */}
       {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden fixed inset-0 bg-black/20 z-40"></div>}
    </>
  );
};

export default DashboardSidebar;