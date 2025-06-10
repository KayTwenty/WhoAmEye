"use client";

import React, { useState } from "react";

export default function GalleryModal({ gallery }: { gallery: string[] }) {
  const [enlargedImg, setEnlargedImg] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="w-full mb-4">
      {/* Modal for enlarged image */}
      {enlargedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setEnlargedImg(null)}
        >
          <img
            src={enlargedImg}
            alt="Enlarged gallery preview"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white select-none pointer-events-auto"
            onClick={e => e.stopPropagation()}
            draggable="false"
            onContextMenu={e => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
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
