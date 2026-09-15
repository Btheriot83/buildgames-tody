"use client";

import { useCallback, useEffect, useState } from "react";

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!msg) return;
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 2200);
    const t2 = setTimeout(() => setMsg(null), 2600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [msg]);

  const toast = useCallback((m: string) => setMsg(m), []);

  return {
    toast,
    node: msg ? (
      <div className="toast-host no-print" aria-live="polite">
        <div className={`t-toast${open ? " is-open" : ""}`}>{msg}</div>
      </div>
    ) : null,
  };
}
