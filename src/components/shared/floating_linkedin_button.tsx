"use client";

import { motion } from "framer-motion";

export function FloatingLinkedInButton() {
  return (
    <motion.a
      href="https://www.linkedin.com/posts/shreyaspawar10_cropiq-androiddevelopment-machinelearning-ugcPost-7466100188231884801-va-O/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-5 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="View CropIQ LinkedIn post"
    >
      {/* Replace the URL below with your copied image address */}
      <img
        src="https://media.licdn.com/dms/image/v2/D4E03AQEIEIlgxjpW0w/profile-displayphoto-crop_800_800/B4EZtW_jK2IUAI-/0/1766691061455?e=1781740800&v=beta&t=2tJtSRPIuUeZH2qCcsqGZitSPSrPDU_mFB7UjJkONcE" // ← put your actual image URL here
        alt="Shreyas Pawar"
        className="h-6 w-6 rounded-full object-cover"
      />
      <span>LinkedIn</span>
    </motion.a>
  );
}