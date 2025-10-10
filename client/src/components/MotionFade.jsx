import { motion } from "framer-motion";

export default function MotionFade({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.20, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
