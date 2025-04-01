
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-resty-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4 text-resty-primary">404</h1>
        <p className="text-2xl text-resty-text mb-6">Oops! Page not found</p>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button className="bg-resty-primary hover:bg-resty-primary/90 text-white">
          <a href="/" className="text-white">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
