"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function NProgressLoader() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    NProgress.start();
    // Simulate a short delay for demo; in real apps, you may want to tie this to actual data loading
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400); // adjust as needed
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}