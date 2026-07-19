import { motion } from "framer-motion";
import Logo from "../Logo";

export default function({className}) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <Logo className={className} />
    </motion.div>
  );
}
