"use client";

import dynamic from "next/dynamic";

// We use next/dynamic to load the components ONLY on the client-side
// as WebGL requires browser APIs (window, document, etc.)
const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false }
);

interface UnicornComponentProps {
  projectId?: string;
  className?: string;
}

/**
 * A reusable Unicorn Studio component wrapper for Next.js.
 * Handles the client-side rendering transition for WebGL.
 */
export default function UnicornComponent({ 
  projectId = "KR4Lp50pTeNcFzJcT0Qd",
  className = "" 
}: UnicornComponentProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <UnicornScene
        projectId={projectId}
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.6/dist/unicornStudio.umd.js"
      />
    </div>
  );
}
