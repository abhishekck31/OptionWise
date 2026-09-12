import Navbar from "@/components/Navbar";
import Footer from "./Footer";

export interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * Page chrome: nav on top, footer underneath, content stretched between.
 * Every route renders inside one of these so the shell never reflows
 * between navigations.
 */
export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PageWrapper;
