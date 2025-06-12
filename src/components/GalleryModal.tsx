"use client";

import React, { useState } from "react";

export default function GalleryModal({ gallery }: { gallery: string[] }) {
  const [enlargedImg, setEnlargedImg] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  // Helper to get current index
  const currentIndex = enlargedImg ? gallery.findIndex(img => img === enlargedImg) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < gallery.length - 1;

  // Smooth swipe support for both desktop and mobile
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = React.useRef<number | null>(null);

  function handlePointerDown(e: React.PointerEvent | React.TouchEvent) {
    setIsSwiping(true);
    if ('touches' in e) {
      touchStart.current = e.touches[0].clientX;
    } else {
      touchStart.current = e.nativeEvent.clientX;
    }
  }
  function handlePointerMove(e: React.PointerEvent | React.TouchEvent) {
    if (!isSwiping || touchStart.current === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.nativeEvent.clientX;
    setSwipeX(clientX - touchStart.current);
  }
  function handlePointerUp(e: React.PointerEvent | React.TouchEvent) {
    if (!isSwiping || touchStart.current === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.nativeEvent.clientX;
    const delta = clientX - touchStart.current;
    setIsSwiping(false);
    setSwipeX(0);
    if (delta > 50 && hasPrev) setEnlargedImg(gallery[currentIndex - 1]); // swipe right
    else if (delta < -50 && hasNext) setEnlargedImg(gallery[currentIndex + 1]); // swipe left
    touchStart.current = null;
  }

  // Keyboard navigation
  React.useEffect(() => {
    if (!enlargedImg) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && hasPrev) setEnlargedImg(gallery[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) setEnlargedImg(gallery[currentIndex + 1]);
      if (e.key === 'Escape') setEnlargedImg(null);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enlargedImg, currentIndex, hasPrev, hasNext, gallery]);

  return (
    <div className="w-full mb-4">
      {/* Modal for enlarged image */}
      {enlargedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setEnlargedImg(null)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Image counter top right */}
          <div className="absolute top-6 right-24 text-white text-base font-semibold bg-black/40 rounded-full px-4 py-1 select-none pointer-events-none shadow-lg">
            {currentIndex + 1} / {gallery.length}
          </div>
          <img
            src={enlargedImg}
            alt="Enlarged gallery preview"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white select-none pointer-events-auto transition-transform duration-300 hover:cursor-pointer"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              transform: `translateX(${swipeX}px)`
            }}
            onClick={e => e.stopPropagation()}
            draggable="false"
            onContextMenu={e => e.preventDefault()}
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 transition"
            onClick={() => setEnlargedImg(null)}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
      )}
      <label className="text-xs text-gray-500 mb-1 block">Gallery</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {gallery.map((img, i) => (
          <div key={i} className="relative group">
            <img
              src={img}
              alt={`Gallery ${i + 1}`}
              className="w-28 h-28 object-cover rounded-lg border shadow cursor-zoom-in transition hover:scale-105"
              onClick={() => setEnlargedImg(img)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
