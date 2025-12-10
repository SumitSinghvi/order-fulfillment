import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="#top" className="text-xl font-bold">
              Order Management
            </a>
            <div />
          </div>
        </div>
      </nav>
      <main id="top" className="container mx-auto px-4 py-8 scroll-smooth">
        {children}
      </main>
    </div>
  );
}
