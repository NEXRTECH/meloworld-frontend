"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card/card";
import Button from "@/components/ui/button/button";
import {
  FaBrain,
  FaHeart,
  FaUsers,
  FaLightbulb,
  FaGraduationCap,
  FaIndustry,
} from "react-icons/fa";

export default function About() {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], ["0%", "-20%"]);

  const teamMembers = [
    {
      name: "Vinay Kumar",
      role: "Co-Founder NeXR Technology",
      bio: "Vinay Kumar is a Design Engineer in the Aviation Industry at a prestigious company. In addition to his professional career, he is also a passionate entrepreneur who has co-founded three startups, two of which are in the health and wellness industry. Vinay is deeply committed to promoting the well-being of society. His startup journey has inspired him to focus on lifestyle management to make mental health affordable and accessible to people of all ages.",
      interests:
        "Apart from his entrepreneurial pursuits, Vinay is also an avid writer and has a passion for poetry. He enjoys exploring the outdoors and can often be found hiking in his free time. Vinay is interested in people, enjoys natural conservation, and participates in charitable events whenever possible.",
      icon: (
        <FaBrain className="text-2xl sm:text-3xl md:text-4xl text-primary" />
      ),
    },
    {
      name: "Shyam G",
      role: "Co-Founder NeXR Technology",
      bio: "Shyam is an alumnus of Alliance B School and a seasoned HR Manager, providing strategic guidance to organisations in achieving their goals. He is passionate about promoting mental health and wellness and is committed to helping individuals lead happier and healthier lives through NeXR Technology.",
      interests:
        "Apart from his professional work, Shyam enjoys playing the guitar and staying fit, as he understands the importance of self-care and personal well-being. His dedication and expertise in mental health management and his passion for music and physical fitness make him an invaluable asset to the NeXR Technology team as he strives to create a world where mental health is prioritised and accessible to all.",
      icon: (
        <FaHeart className="text-2xl sm:text-3xl md:text-4xl text-primary" />
      ),
    },
  ];

  const values = [
    {
      title: "Scientific Excellence",
      description:
        "Every feature and therapy session is grounded in peer-reviewed research and clinical validation.",
      icon: <FaGraduationCap className="text-3xl text-primary" />,
    },
    {
      title: "Accessibility",
      description:
        "We believe mental health care should be available to everyone, regardless of their socioeconomic status.",
      icon: <FaUsers className="text-3xl text-primary" />,
    },
    {
      title: "Innovation",
      description:
        "We continuously push the boundaries of what's possible in mental health technology.",
      icon: <FaLightbulb className="text-3xl text-primary" />,
    },
    {
      title: "Impact",
      description:
        "We measure our success by the positive change we create in people's lives and communities.",
      icon: <FaIndustry className="text-3xl text-primary" />,
    },
  ];

  return (
    <div ref={scrollRef} className="bg-white text-gray-800 overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <div className="h-[110vh] mt-5 lg:mt-0 p-8">
          <motion.div
            className="h-screen bg-gradient-to-br mt-5 lg:mt-0 from-secondary/40 to-white w-full sticky top-0 flex items-center justify-center"
            style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          >
            <div className="absolute inset-0 -z-10" />
            <div className="container grid md:grid-cols-2 gap-6 md:gap-8 items-center mx-auto px-4 sm:px-6 md:px-8">
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
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  At NeXR Technology, we aim to make{" "}
                  <span className="text-primary">mental health accessible</span>{" "}
                  and affordable to everyone.
                </motion.h1>
                <motion.p
                  className="mt-4 sm:mt-6 mb-6 sm:mb-10 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  Vinay Kumar and Shyam G are the co-founders of{" "}
                  <strong>
                    NeXR Technology, a mental health platform that aims to make
                    mental health accessible and affordable to everyone.
                  </strong>{" "}
                  Vinay is a Design Engineer in the Aviation Industry with a
                  passion for entrepreneurship, while Shyam is an HR Manager
                  focusing on strategic guidance for organisations.
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
                        .getElementById("team-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    size="sm"
                    className="bg-gray-900 text-white hover:bg-sky-900 shadow-lg px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    Meet Our Team
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex opacity-75 justify-center mt-6 sm:mt-8 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.75, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <FaBrain className="text-4xl sm:text-6xl md:text-8xl text-primary mx-auto mb-2 sm:mb-4" />
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-sky-900 px-2">
                      Mental Health Innovation
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mission Section */}
        <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white to-secondary/40 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Our Mission & Vision
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto">
                Together, they share a vision of creating a world where mental
                health is prioritised and accessible to all, regardless of their
                socioeconomic status. They are passionate about promoting mental
                well-being and believe everyone should have the tools and
                resources necessary to lead a healthy and fulfilling life.With
                their combined expertise and dedication, NeXR Technology is
                committed to providing a holistic approach to mental health
                management that emphasises lifestyle management and wellness.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto">
                They believe that by providing affordable and accessible mental
                health resources, they can help individuals lead happier and
                healthier lives, ultimately contributing to a happier, healthier
                society as a whole.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto mt-3 sm:mt-4">
                Overall, their vision for NeXR Technology is to build & create a
                universe where mental health is a fundamental need, not a
                luxury, and everyone can live a fulfilling and joyful life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section
          id="team-section"
          className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-secondary/40 to-white relative z-10"
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                People Behind NeXR Technology
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex"
                >
                  <Card className="p-4 sm:p-6 md:p-8 bg-white flex flex-col h-full w-full">
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        {member.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                        {member.name}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 font-semibold">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {member.interests}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-secondary/40 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Our Core Values
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and shape how we serve
                our community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-4 sm:p-6 text-center bg-white h-52">
                    <div className="mb-3 sm:mb-4">{value.icon}</div>
                    <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                      {value.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-800 flex text-white relative z-10">
          <div className="container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Join Us in Transforming Mental Health
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Whether you're an organization looking to support your team's
              mental health, a healthcare provider wanting to offer innovative
              treatments, or an individual seeking better mental wellness tools,
              we're here to help.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                size="xs"
                primaryColor="white"
                secondaryColor="#024a70"
                variant="outline"
                className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              >
                <a href="mailto:info@wellbe.club">Request for Demo</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
