"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TbMenu2 } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/nexr transparent background.png";
import { useAuthStore } from "../stores/auth-store";
import { useCandidateStore } from "../stores/candidate-store";
import Button from "./button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover/popover";
import { FaUserTie, FaUserGraduate, FaBuilding, FaHeartbeat, FaSignInAlt } from "react-icons/fa";

const loginRoles = [
    {
        role: "Student / Employee",
        description: "Access your assessments and track your progress.",
        href: "/auth/candidate/login",
        icon: <FaUserGraduate className="text-2xl text-primary" />
    },
    {
        role: "Admin",
        description: "Manage users, assessments, and system settings.",
        href: "/auth/admin/login",
        icon: <FaUserTie className="text-2xl text-primary" />
    },
    {
        role: "Therapist",
        description: "Connect with patients and manage sessions.",
        href: "/auth/therapist/login",
        icon: <FaHeartbeat className="text-2xl text-primary" />
    },
    {
        role: "Organization",
        description: "Oversee your employees and view reports.",
        href: "/auth/org/login",
        icon: <FaBuilding className="text-2xl text-primary" />
    }
]

const Navbar: React.FC = () => {
  const { userRole, token, clearAuth } = useAuthStore();
  const { clearCandidateStore } = useCandidateStore();
  const pathname = usePathname();

  const [navbarItems, setNavbarItems] = useState<{ name: string; link?: string; onClick?: () => void; }[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Determine navbar items based on auth state
  useEffect(() => {
    if (token && userRole === "candidate") {
      setNavbarItems([
        { name: "Home", link: "/candidate" },
        { name: "Assessments", link: "#" }, // Example link
        { name: "Profile", link: "#" },       // Example link
      ]);
    } else {
      // Default items for logged-out users
      setNavbarItems([
        { name: "Home", link: "/" },
        { name: "About", link: "#" },
        { name: "Services", link: "#" },
        { name: "Contact", link: "#" },
      ]);
    }
  }, [userRole, token]);

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearCandidateStore();
    clearAuth();
    setShowMenu(false); // Close menu on logout
  };

  // Hide navbar on certain routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/therapist") || pathname.startsWith("/org")) {
    return null;
  }

  const isLandingPage = pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 py-3 transition-all duration-300 ${
          scrolled || !isLandingPage ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/80 shadow-sm' : 'bg-transparent'
        }`}
      >
        {/* --- DESKTOP NAVBAR --- */}
        <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto px-8 py-2">
          <Link href="/">
            <Image src={logo} alt="MeloWorld Logo" width={120} priority />
          </Link>
          <div className="flex items-center gap-6">
            {navbarItems.map((item) => (
              <Link key={item.name} href={item.link || "#"} className="relative group">
                <span className={`transition-colors duration-300 text-gray-800`}>{item.name}</span>
                <AnimatePresence>
                  {pathname === item.link && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-primary"
                    />
                  )}
                </AnimatePresence>
                 <div className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
            {token ? (
              <Button onClick={handleLogout} size="sm">
                Logout
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" icon={<FaSignInAlt />}>Sign In</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[32rem]">
                  <div className="grid gap-4 p-5">
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">Welcome Back!</h4>
                      <p className="text-sm text-gray-500">
                        Choose your role to sign in to your account.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {loginRoles.map((role) => (
                         <Link
                            key={role.role}
                            href={role.href}
                            className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    {role.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{role.role}</span>
                                    <span className="text-xs text-gray-500">{role.description}</span>
                                </div>
                            </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* --- MOBILE NAVBAR --- */}
        <div className="lg:hidden flex items-center justify-between px-6 py-2">
          <Link href="/">
            <Image src={logo} alt="MeloWorld Logo" width={100} priority />
          </Link>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full z-[100]"
          >
            {showMenu ? <IoClose size={28} className={(scrolled || !isLandingPage) ? 'text-gray-800' : 'text-white'} /> : <TbMenu2 size={28} className={(scrolled || !isLandingPage) ? 'text-gray-800' : 'text-white'} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0)' }}
            animate={{ clipPath: 'circle(150% at 100% 0)' }}
            exit={{ clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 w-full h-screen bg-white z-[49]"
          >
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 }}}}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              {navbarItems.map((item) => (
                <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                    <Link
                    href={item.link || "#"}
                    className="text-3xl font-semibold text-gray-800"
                    onClick={() => setShowMenu(false)}
                    >
                    {item.name}
                    </Link>
                </motion.div>
              ))}
              {token ? (
                 <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                    <Button onClick={handleLogout} size="lg" variant="outline">Logout</Button>
                 </motion.div>
              ) : (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="lg" variant="outline" icon={<FaSignInAlt />}>Sign In</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-5">
                       <div className="grid gap-4 p-5">
                        <div className="space-y-1">
                          <h4 className="font-medium leading-none">Welcome Back!</h4>
                          <p className="text-sm text-gray-500">
                            Choose your role to sign in to your account.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {loginRoles.map((role) => (
                             <Link
                                key={role.role}
                                href={role.href}
                                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={() => setShowMenu(false)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        {role.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{role.role}</span>
                                        <span className="text-xs text-gray-500">{role.description}</span>
                                    </div>
                                </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;