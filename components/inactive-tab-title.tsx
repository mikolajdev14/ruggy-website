"use client";

import { useEffect } from "react";

const INACTIVE_TAB_TITLE = "WRACAJ TU BYCZKU";

export function InactiveTabTitle() {
  useEffect(() => {
    let activeTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        activeTitle = document.title;
        document.title = INACTIVE_TAB_TITLE;
        return;
      }

      document.title = activeTitle;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (document.title === INACTIVE_TAB_TITLE) {
        document.title = activeTitle;
      }
    };
  }, []);

  return null;
}
