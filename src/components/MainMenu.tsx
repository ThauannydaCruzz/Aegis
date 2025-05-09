
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

// Menu principal para funcionalidades extras - iremos usar para opções complementares
const MainMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Don't render menu on the index page
  if (location.pathname === '/') {
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  return (
    <>
      {isMobile ? (
        <>
          <Button
            variant="ghost" 
            size="icon"
            className="fixed top-4 right-4 z-30 text-white"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-black/90 z-40 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-end">
                <Button
                  variant="ghost" 
                  size="icon"
                  className="text-white mb-8"
                  onClick={toggleMobileMenu}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-6 flex-1">
                <Button
                  variant="ghost"
                  size="mobile-lg"
                  className="w-full text-xl text-white"
                  onClick={() => navigateTo('/security-dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="mobile-lg"
                  className="w-full text-xl text-white"
                  onClick={() => navigateTo('/aegis-team')}
                >
                  Equipe
                </Button>
                <Button
                  variant="ghost"
                  size="mobile-lg"
                  className="w-full text-xl text-white"
                  onClick={() => navigateTo('/chatbot')}
                >
                  IA Segurança
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="bg-transparent text-white/80 hover:text-white hover:bg-transparent focus:bg-transparent"
                >
                  Opções
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/security-dashboard')}
                        >
                          Dashboard
                        </Button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/aegis-team')}
                        >
                          Equipe
                        </Button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/chatbot')}
                        >
                          IA Segurança
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </>
  );
};

// Type definition for NavigationMenuLink
type NavigationMenuLink = React.FC<{
  asChild: boolean;
  children: React.ReactNode;
}>;

// Create NavigationMenuLink component
const NavigationMenuLink: NavigationMenuLink = ({ asChild, children }) => {
  if (asChild) {
    return <>{children}</>;
  }
  return <>{children}</>;
};

export default MainMenu;
