
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're on the index page
  const isIndexPage = location.pathname === '/';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  return (
    <>
      <nav className="absolute top-0 left-0 right-0 w-full py-6 px-6 md:px-10 lg:px-20 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
          <ShieldCheck className="h-8 w-8 text-aegis-purple" />
          <div className="text-2xl font-bold text-white">
            <span className="aegis-gradient-text">Aegis</span>
          </div>
        </div>
        
        {!isIndexPage && !location.pathname.includes('/login') && (
          <>
            {isMobile ? (
              <button 
                className="text-white p-2 focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </button>
            ) : (
              <div className="flex items-center gap-8 text-white/80">
                <button className="hover:text-white transition-colors" onClick={() => navigateTo('/aegis-team')}>
                  Sobre
                </button>
                <button className="hover:text-white transition-colors" onClick={() => navigateTo('/security-dashboard')}>
                  Dashboard
                </button>
                <button className="hover:text-white transition-colors" onClick={() => navigateTo('/chatbot')}>
                  IA Segurança
                </button>
                <button className="px-5 py-2 bg-aegis-purple rounded-md text-white hover:bg-aegis-purple/90 transition-colors" onClick={() => navigateTo('/login')}>
                  Login
                </button>
                <button className="px-5 py-2 bg-white text-aegis-purple rounded-md hover:bg-white/90 transition-colors" onClick={() => navigateTo('/login')}>
                  Comece Agora
                </button>
              </div>
            )}
          </>
        )}
      </nav>
      
      {/* Mobile Menu */}
      {isMobile && (
        <div className={`mobile-menu-container ${mobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}>
          <div className="flex justify-end p-6">
            <button 
              className="text-white p-2 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-8 mt-24 text-white/80">
            <button className="text-xl hover:text-white transition-colors" onClick={() => navigateTo('/aegis-team')}>
              Sobre
            </button>
            <button className="text-xl hover:text-white transition-colors" onClick={() => navigateTo('/security-dashboard')}>
              Dashboard
            </button>
            <button className="text-xl hover:text-white transition-colors" onClick={() => navigateTo('/chatbot')}>
              IA Segurança
            </button>
            <button className="px-8 py-3 mt-4 bg-aegis-purple rounded-md text-white hover:bg-aegis-purple/90 transition-colors text-xl" onClick={() => navigateTo('/login')}>
              Login
            </button>
            <button className="px-8 py-3 mt-2 bg-white text-aegis-purple rounded-md hover:bg-white/90 transition-colors text-xl" onClick={() => navigateTo('/login')}>
              Comece Agora
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
