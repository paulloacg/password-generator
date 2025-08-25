'use client';

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium
        z-50 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      Pular para o conteúdo principal
    </a>
  );
}