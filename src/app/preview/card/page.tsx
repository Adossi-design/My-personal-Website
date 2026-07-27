import type { Metadata } from "next";
import { CardPreviewFrame } from "./CardPreviewFrame";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CardPreviewPage() {
  return <CardPreviewFrame />;
}
