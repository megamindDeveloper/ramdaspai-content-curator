"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut, Headphones, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type HeaderProps = {
  onAddClick: () => void;
};

export function Header({ onAddClick }: HeaderProps) {
  const { signOut } = useAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const openSupportModal = () => setIsSupportOpen(true);
  const closeSupportModal = () => setIsSupportOpen(false);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b bg-card">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="relative w-52 h-20">
          <Image src="/image.png" alt="MAHE Logo" fill className="object-contain" />
        </div>

        {/* Title + Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">MAHE Content Management Portal</h1>
          <p className="text-sm text-muted-foreground mb-1">Dashboard — Dr. Ramdas Pai</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <Button onClick={onAddClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>

        <Button onClick={openSupportModal} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Headphones className="w-4 h-4 mr-2" />
          Support
        </Button>

        <Button onClick={signOut} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Support Modal */}
      <AnimatePresence>
        {isSupportOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              className="fixed inset-0 bg-black/70"
              onClick={closeSupportModal} // close when clicking on backdrop
            />

            {/* Modal Content */}
            <motion.div
              variants={modalVariants}
              className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl z-10"
            >
              <button
                onClick={closeSupportModal}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold mb-4">Support</h2>
              <p className="text-sm mb-2">
                <span className="font-medium">Email:</span> developer@megamind.studio
              </p>
              <p className="text-sm">
                <span className="font-medium">Mobile:</span> 8792933124
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
