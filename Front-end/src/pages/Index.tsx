
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Animation for background particles
  useEffect(() => {
    const createParticles = () => {
      const particleContainer = document.getElementById('particle-container');
      if (particleContainer) {
        particleContainer.innerHTML = '';
        const numberOfParticles = 50;
        
        for (let i = 0; i < numberOfParticles; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          
          // Random position
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          particle.style.left = `${posX}%`;
          particle.style.top = `${posY}%`;
          
          // Random size
          const size = Math.random() * 3 + 1;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          
          particleContainer.appendChild(particle);
        }
      }
    };
    
    createParticles();
    window.addEventListener('resize', createParticles);
    
    return () => {
      window.removeEventListener('resize', createParticles);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {/* Particle background */}
      <div id="particle-container" className="fixed inset-0 z-0"></div>
      
      {/* Purple glow at bottom */}
      <div className="absolute bottom-[-10%] left-0 w-full h-[40%] bg-aegis-purple/20 blur-[100px] rounded-full"></div>
      
      <Navbar />
      
      <div className="relative h-full w-full flex flex-col items-center justify-center px-6 z-10">
        {/* Badge */}
        <div className="mb-4 sm:mb-6 px-4 py-1 bg-aegis-purple/20 backdrop-blur-sm rounded-full border border-aegis-purple/30 text-xs sm:text-sm">
          Segurança de Precisão
        </div>
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl mb-2 sm:mb-4">
          Inteligência adaptativa,
          <br />proteção atemporal
        </h1>
        
        {/* Subheading */}
        <p className="text-white/70 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl text-center mb-6 sm:mb-10 px-4">
          Experimente o futuro da cibersegurança — projetada para adaptar, evoluir e salvaguardar 
          as fundações críticas do seu sucesso.
        </p>
        
        {/* CTA Button */}
        <Button 
          className="px-6 sm:px-8 py-4 sm:py-6 bg-aegis-purple hover:bg-aegis-purple/90 text-white rounded-md text-base sm:text-lg"
          onClick={() => navigate('/login')}
        >
          Comece Agora
        </Button>
        
        {/* Hero Image */}
        <div className="mt-10 sm:mt-16 relative">
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 relative">
            {/* Shield with keyhole */}
            <div className="w-full h-full bg-gradient-to-b from-aegis-purple/80 to-transparent rounded-t-full rounded-b-[70%] flex items-center justify-center glow-purple">
              <div className="w-8 sm:w-12 h-16 sm:h-20 bg-black rounded-t-full"></div>
            </div>
            
            {/* Particles around the shield */}
            <div className="absolute inset-0 -z-10">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-aegis-purple/60 rounded-full blur-sm animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${4 + Math.random() * 3}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
