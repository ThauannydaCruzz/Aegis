
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Welcome = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [typedText, setTypedText] = useState('');
  const fullText = "Olá! Sou o Aegis. Estou aqui para garantir a segurança dos seus dados e proteger sua privacidade.";
  const [typingComplete, setTypingComplete] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  
  useEffect(() => {
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(currentIndex));
        currentIndex++;
        
        if (Math.random() > 0.7) {
          setIsTalking(true);
          setTimeout(() => setIsTalking(false), 200);
        }
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, []);
  
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  useEffect(() => {
    if (typingComplete) {
      const talkInterval = setInterval(() => {
        setIsTalking(true);
        setTimeout(() => setIsTalking(false), 200);
      }, 2000);
      
      return () => clearInterval(talkInterval);
    }
  }, [typingComplete]);
  
  const handleNextClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4">
      <div className={`relative ${isMobile ? 'w-52 h-52' : 'w-64 h-64'} mb-10`}>
        <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-aegis-purple/40 to-transparent blur-xl animate-pulse"></div>
        <div className="absolute w-3/4 h-3/4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-aegis-purple/60 to-transparent blur-lg animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute w-1/2 h-1/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-aegis-purple/80 to-transparent blur-md animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        
        <div className="absolute w-full h-full flex items-center justify-center">
          <div className="relative w-20 h-20">
            <div className={`absolute top-6 left-3 w-3 h-${isBlinking ? '0.5' : '3'} bg-white rounded-full transition-all duration-100`}></div>
            <div className={`absolute top-6 right-3 w-3 h-${isBlinking ? '0.5' : '3'} bg-white rounded-full transition-all duration-100`}></div>
            
            <div 
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-6 border-b-2 border-white rounded-full transition-all duration-100 ${isTalking ? 'h-3 border-b-3' : 'h-6'}`}
              style={{ transform: `translateX(-50%) ${isTalking ? 'scaleY(0.7)' : 'scaleY(1)'}` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md mx-auto text-center mb-10">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-medium text-aegis-purple mb-2`}>
          Aegis Security
        </h1>
        <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-white min-h-[6rem]`}>
          {typedText}
          <span className={`inline-block w-2 h-5 bg-white ml-1 ${typingComplete ? 'animate-pulse' : 'animate-[blink_1s_step-end_infinite]'}`}></span>
        </p>
      </div>
      
      <Button 
        onClick={handleNextClick}
        className="w-full max-w-md bg-aegis-purple hover:bg-aegis-purple/90 text-white rounded-full py-6"
      >
        Prosseguir
      </Button>
      
      <p className="text-white/60 text-sm mt-6 text-center max-w-md px-4">
        O Aegis utiliza criptografia avançada para proteger seus dados.
        Suas informações nunca são compartilhadas com terceiros.
      </p>
    </div>
  );
};

export default Welcome;
