"use client";

import { useRef } from "react";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import heroImage from "@/assets/hero.png";
import Image from "next/image";

const featureIcons = {
  "Medical Grade Precision": (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-primary"
    >
      <path
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38.6274 9.37256L32 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.37256 38.6274L16 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38.6274 38.6274L32 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.37256 9.37256L16 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "Proprietary Algorithms": (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-primary"
    >
      <path
        d="M10 42L10 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 42V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 42V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "Multi-Sensory Perception": (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-primary"
    >
      <path
        d="M4 24C4 24 10 12 24 12C38 12 44 24 44 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 24C4 24 10 36 24 36C38 36 44 24 44 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "Graded Exposure": (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-primary"
    >
      <path
        d="M8 24H40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16H40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 32H40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10L8 16L14 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 26L40 32L34 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const sectorIcons = {
  "Corporate Wellness": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto text-primary"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
  "Educational Institutions": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto text-primary"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  "Hospitals & Clinics": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto text-primary"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  ),
};

export default function Home() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], ["0%", "-20%"]);

  return (
    <div ref={scrollRef} className="bg-white text-gray-800 overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="h-[110vh]">
          <motion.div
            className="h-screen bg-gradient-to-br mt-5 lg:mt-0 from-secondary/40 to-white w-full sticky top-0 flex items-center justify-center"
            style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          >
            <div className="absolute inset-0 -z-10" />
            <div className="container grid md:grid-cols-2 gap-8 items-center mx-auto px-6 md:px-8">
              <motion.div
                className="text-center md:text-left flex flex-col items-center md:items-start"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.2,
                    },
                  },
                }}
              >
                <motion.h1
                  className="text-4xl md:text-6xl font-bold leading-tight"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  The Future of Mental Wellness:{" "}
                  <span className="text-primary">Immersive XR Therapy</span>
                </motion.h1>
                <motion.p
                  className="mt-6 mb-10 text-lg text-gray-600 max-w-xl"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  NeXR Technology delivers transformative mental wellness
                  experiences through XR therapy sessions. We partner with
                  organizations in the corporate, educational, and healthcare
                  sectors to provide accessible and effective care.
                </motion.p>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Button
                    onClick={() =>
                      document
                        .getElementById("join-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    size="sm"
                    className="bg-gray-900 text-white hover:bg-gray-700 shadow-lg px-10 py-3"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex opacity-75 justify-center mt-8 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.75, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Image
                  src={heroImage}
                  alt="Hero illustration"
                  width={500}
                  height={500}
                  priority
                  className="rounded-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section className="py-32 bg-gradient-to-b from-white to-secondary/40 relative z-10">
          <div className="container mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold">
                Built on a Foundation of Science
              </h2>
              <p className="text-lg text-gray-600 mt-4">
                Our cutting-edge platform is grounded in over three decades of
                pioneering research across Neuroscience, Psychology, and
                Psychiatry, delivering scientifically-backed therapeutic
                experiences.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-8">
              {Object.entries(featureIcons).map(([title, icon], i) => (
                <motion.div
                  className="text-center bg-white p-6 rounded-lg shadow-lg"
                  key={title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                >
                  {icon}
                  <h3 className="text-md font-semibold mt-4">{title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions for Every Sector Section */}
        <section className="py-24 bg-gradient-to-b from-secondary/40 to-white relative z-10">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold">
                Solutions for Every Sector
              </h2>
              <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                We partner with leading organizations across various industries
                to deliver targeted mental wellness programs that address their
                unique challenges.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(sectorIcons).map(
                ([title, icon], i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="p-8 text-center bg-white h-[320px]">
                      {icon}
                      <h3 className="font-bold text-xl mt-4">{title}</h3>
                      <p className="text-gray-600 mt-2">
                        {
                          {
                            "Corporate Wellness":
                              "Enhance employee well-being with our psychometry assessments and tailored XR programs, designed to reduce burnout and boost productivity.",
                            "Educational Institutions":
                              "Support student mental health with our evidence-based psychometry assessments and virtual reality experiences, creating a more resilient campus community.",
                            "Hospitals & Clinics":
                              "Integrate cutting-edge XR therapy into your clinical practice to offer patients innovative and effective treatment options.",
                          }[title]
                        }
                      </p>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-b from-white to-secondary/40 relative z-10">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold">
                Simple to Start, Powerful to Use
              </h2>
            </motion.div>

            <div className="relative mt-16">
              <div className="absolute top-0 w-0.5 h-full bg-gray-200 left-4 md:left-1/2 md:-translate-x-1/2"></div>

              <div className="space-y-12">
                {[
                  {
                    title: "Tailored Assessment",
                    description:
                      "Our process begins with a comprehensive evaluation to understand your specific requirements and goals.",
                  },
                  {
                    title: "Seamless Integration",
                    description:
                      "Experience a smooth transition with our quick setup and dedicated training and support.",
                  },
                  {
                    title: "Launch with Confidence",
                    description:
                      "Immediately begin leveraging our proven XR therapies to make a difference.",
                  },
                  {
                    title: "Measure What Matters",
                    description:
                      "Track engagement and outcomes in real-time through our intuitive analytics dashboard.",
                  },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className="absolute w-4 h-4 bg-primary rounded-full mt-2 left-4 md:left-1/2 -translate-x-1/2 border-4 border-white"></div>

                    <motion.div
                      className={`pl-10 md:pl-0 md:w-1/2 ${
                        i % 2 === 0 ? "md:pr-8" : "md:pl-8 md:ml-auto"
                      }`}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card
                        className={`p-6 bg-white border border-gray-200 ${
                          i % 2 === 0 ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        <h3 className="font-bold text-primary text-xl">{`0${
                          i + 1
                        }`}</h3>
                        <h4 className="font-semibold text-lg mt-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {step.description}
                        </p>
                      </Card>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-800 flex text-white relative z-10">
          <div className="container mx-auto flex flex-col items-center justify-center px-6 md:px-8 py-20 text-center">
            <motion.h2
              className="text-3xl lg:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Reshape the Future of Mental Health
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Join us in our mission to make high-quality mental healthcare
              accessible to everyone, everywhere through the power of immersive
              technology.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                onClick={() => router.push("/auth/therapist/login")}
                size="sm"
                primaryColor="white"
                secondaryColor="#024a70"
                variant="outline"
              >
                Request a Demo
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
