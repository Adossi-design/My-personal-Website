import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../(public)/globals.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Imports the public stylesheet but not the nav or footer, so the admin iframe
// shows the card exactly as the site styles it and nothing else.
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
