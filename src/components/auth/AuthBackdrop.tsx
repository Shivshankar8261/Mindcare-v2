"use client";

import { motion } from "framer-motion";

/** Matches the landing page “Calm Futurism” ambient backdrop for auth routes. */
export default function AuthBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-24 left-10 w-64 h-64 rounded-full bg-teal/20 blur-3xl"
        animate={{ y: [0, 24, 0], x: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 rounded-full bg-saffron/15 blur-3xl"
        animate={{ y: [0, -18, 0], x: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-rose/10 blur-3xl"
        animate={{ y: [0, -16, 0], x: [0, 9, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
