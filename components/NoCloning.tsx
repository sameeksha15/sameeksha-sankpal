"use client";

import { useEffect } from "react";

const STATE_PATTERN = /\|(ψ|psi|0|1|\+)⟩/;

/**
 * Copying a quantum state gets a nod to the no-cloning theorem. Console only:
 * the clipboard is never touched, the copy works exactly as expected.
 */
export default function NoCloning() {
  useEffect(() => {
    const onCopy = () => {
      const selection = window.getSelection()?.toString() ?? "";
      if (!STATE_PATTERN.test(selection)) return;
      console.log(
        "%cno-cloning theorem: an unknown quantum state cannot be copied exactly.",
        "font-family:monospace;color:#d8a854;font-size:13px",
      );
      console.log(
        "%cwhat you have is an approximation. (the text in your clipboard is fine.)",
        "font-family:monospace;color:#9d937f;font-size:12px",
      );
    };
    document.addEventListener("copy", onCopy);
    return () => document.removeEventListener("copy", onCopy);
  }, []);

  return null;
}
