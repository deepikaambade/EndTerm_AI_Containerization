
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 py-12">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-7xl font-bold tracking-tighter animate-float">404</h1>
              <p className="text-3xl font-medium tracking-tight">Page not found</p>
              <p className="text-muted-foreground max-w-[600px] mx-auto mt-4">
                Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
              </p>
            </div>
            
            <div className="w-full max-w-sm space-y-4">
              <div className="w-64 h-64 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse-slow"></div>
                <svg
                  className="w-full h-full text-primary opacity-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"></path>
                  <path d="M18 14v4h4"></path>
                  <path d="M18 18l-5-5"></path>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
              </div>
              
              <Link to="/">
                <Button className="w-full">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
