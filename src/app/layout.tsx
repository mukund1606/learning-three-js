import type { Metadata } from "next";

// Styles
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Learning Three.js",
  description: "",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
