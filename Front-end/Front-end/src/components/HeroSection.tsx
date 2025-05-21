
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircuitBoard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  // Criar partículas aleatórias para o fundo
  const [particles, setParticles] = useState<Array<{id: number, size: number, top: string, left: string, delay: number}>>([]);
  
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        size: Math.random() * 20 + 5,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5
      });
    }
    setParticles(newParticles);
  }, []);

  const handleSaibaMaisClick = () => {
    navigate('/login');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-160px)] px-6 md:px-10 lg:px-20 flex flex-col md:flex-row items-center">
      {/* Partículas de fundo */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            animationDelay: `${particle.delay}s`,
            opacity: Math.random() * 0.5 + 0.1
          }}
        />
      ))}
      
      {/* Conteúdo do texto */}
      <div className="md:w-1/2 z-10 pt-10 md:pt-0">
        <h1 className="text-7xl font-bold mb-4">
          <span className="text-white">Aegis</span><br />
          <span className="text-aegis-purple">Security</span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-md">
          Aegis nova geração de segurança para proteção total contra ameaças
        </p>
        <Button 
          className="aegis-gradient-button text-white px-8 py-6 text-lg rounded-full"
          onClick={handleSaibaMaisClick}
        >
          Saiba mais
        </Button>
      </div>
      
      {/* Vetor tecnológico roxo no lugar da imagem do laptop */}
      <div className="md:w-1/2 mt-10 md:mt-0 z-10 flex justify-center items-center animate-float">
        <div className="relative flex flex-col items-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-aegis-purple/20 to-aegis-glow/10 flex items-center justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-aegis-purple/30 to-aegis-glow/20 flex items-center justify-center">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-aegis-purple/40 to-aegis-glow/30 flex items-center justify-center">
                <CircuitBoard className="w-24 h-24 md:w-32 md:h-32 text-aegis-purple animate-glow" />
              </div>
            </div>
          </div>
          
          {/* Pequenos círculos orbitando */}
          <div className="absolute w-full h-full animate-[spin_20s_linear_infinite]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 bg-aegis-purple/80 rounded-full"></div>
          </div>
          <div className="absolute w-full h-full animate-[spin_15s_linear_infinite_reverse]">
            <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-aegis-glow/80 rounded-full"></div>
          </div>
          <div className="absolute w-full h-full animate-[spin_25s_linear_infinite]">
            <div className="absolute top-1/4 right-0 w-5 h-5 bg-aegis-purple/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
