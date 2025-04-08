
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleStartChatting = () => {
    navigate('/chat');
  };

  // Updated navigation links with proper routes
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Cuisines', href: '/#cuisines' },
    { name: 'Testimonials', href: '/#testimonials' },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('/#')) {
      // Handle anchor links within the home page
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      
      if (location.pathname !== '/') {
        // If not on home page, navigate there first then scroll
        navigate('/', { state: { scrollTo: targetId } });
      } else if (targetElement) {
        // If already on home page, just scroll to the element
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle regular page navigation
      navigate(href);
    }
    
    // Close mobile menu if it's open
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Add effect to handle scrolling to sections after navigation
  useEffect(() => {
    if (location.pathname === '/' && location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Small delay to ensure the page has loaded
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container-custom flex justify-between items-center h-16 md:h-20">
        <Link to="/" className="text-2xl md:text-3xl font-bold text-resty-primary">
          Resty
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-resty-text">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-resty-text hover:text-resty-primary transition-colors"
              onClick={(e) => handleNavLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <Button 
            className="bg-resty-primary hover:bg-resty-primary/90 text-white font-medium"
            onClick={handleStartChatting}
          >
            Start Chatting
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white p-4 shadow-md border-t z-50">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name} 
                href={link.href} 
                className="text-resty-text py-2 hover:text-resty-primary"
                onClick={(e) => handleNavLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <Button 
              className="bg-resty-primary hover:bg-resty-primary/90 text-white w-full mt-2 font-medium"
              onClick={() => {
                setIsOpen(false);
                handleStartChatting();
              }}
            >
              Start Chatting
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
