import React from "react";
import { motion } from "framer-motion";

const tips = [
  "✅ Set clear goals before starting a task.",
  "🗣️ Communicate frequently with clients.",
  "🧰 Keep your portfolio updated.",
  "⏰ Manage your time effectively.",
  "📈 Ask for feedback to improve.",
  "💼 Always read the task requirements carefully.",
  "🤝 Build long‑term relationships with trusted clients.",
  "💡 Keep learning new skills to stay competitive.",
];

// ---- Animation variants --- 
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      when: "beforeChildren",
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320 } },
};

const TipsAndTricks = () => (
  <section className="bg-base-200 py-12 px-4 md:px-8 rounded-lg container mx-auto">
    {/* Heading */}
    <motion.h2
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-3xl md:text-4xl font-bold mb-6 text-center text-primary"
    >
      Tips & Tricks for Freelancers
    </motion.h2>

    {/* Tips list */}
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="list-disc list-inside space-y-4 text-gray-600 text-lg md:text-xl font-medium"
    >
      {tips.map((tip, idx) => (
        <motion.li
          key={idx}
          variants={item}
          whileHover={{ scale: 1.05 }}
          className="hover:text-primary transition-colors duration-200"
        >
          {tip}
        </motion.li>
      ))}
    </motion.ul>
  </section>
);

export default TipsAndTricks;
