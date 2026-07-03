"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { collection, getCountFromServer } from "firebase/firestore";
import { rtdb, db } from "@/lib/firebase/client";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!rtdb || !db) return;

    const countRef = ref(rtdb, "Count/totalVisitors");

    const unsub = onValue(countRef, async (snapshot) => {
      const rtdbVal = snapshot.val();
      if (rtdbVal && Number(rtdbVal) > 0) {
        setCount(Number(rtdbVal));
      } else {
        try {
          if (!db) { setCount(0); return; }
          const snap = await getCountFromServer(
            collection(db, "analytics", "visitors", "all")
          );
          setCount(snap.data().count);
        } catch {
          setCount(0);
        }
      }
    });

    return () => unsub();
  }, []);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-xl"
      title="Total unique visitors"
    >
      <Eye className="h-4 w-4 text-cyan-400" />
      <span className="text-muted-foreground">Visits:</span>
      <span className="tabular-nums text-foreground">{count.toLocaleString()}</span>
    </motion.div>
  );
}
