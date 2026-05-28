"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { loginAdmin } from "@/lib/services/admin-auth.service";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginAdmin(); // this already sets the cookie
      window.location.href = "/admin";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass w-full max-w-xl rounded-3xl p-8"
      >
        <h1 className="text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only authorized administrators can access this area.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Please sign in with a whitelisted Google account.
        </p>
        <Button
          className="mt-6 w-full"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </Button>
      </motion.div>
    </section>
  );
}