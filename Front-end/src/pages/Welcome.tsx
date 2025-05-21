
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = "Olá! Sou o Aegis. Estou aqui para garantir a segurança dos seus dados e proteger sua privacidade.";
  const [typingComplete, setTypingComplete] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [eyeShift, setEyeShift] = useState({ x: 0, y: 0 });
  const [faceExpression, setFaceExpression] = useState('neutral');

  useEffect(() => {
    let cancelled = false;

    const typeText = async () => {
      for (let i = 0; i < fullText.length; i++) {
        if (cancelled) return;

        setTypedText(prev => prev + fullText[i]);

        // Boca falando
        if (Math.random() > 0.6) {
          setIsTalking(true);
          setTimeout(() => setIsTalking(false), Math.random() * 200 + 100);
        }

        // Olhos se movendo
        if (Math.random() > 0.9) {
          const shift = { 
            x: (Math.random() * 2 - 1) * 2, 
            y: (Math.random() * 2 - 1) 
          };
          setEyeShift(shift);
          setTimeout(() => setEyeShift({ x: 0, y: 0 }), 800);
        }

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      if (!cancelled) {
        setTypingComplete(true);
        setFaceExpression('friendly');
      }
    };

    typeText();

    return () => { cancelled = true };
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (typingComplete) {
      const expressionInterval = setInterval(() => {
        const expressions = ['neutral', 'friendly', 'thoughtful'];
        setFaceExpression(expressions[Math.floor(Math.random() * expressions.length)]);

        if (Math.random() > 0.7) {
          setEyeShift({ 
            x: (Math.random() * 2 - 1) * 2, 
            y: (Math.random() * 2 - 1) 
          });
          setTimeout(() => setEyeShift({ x: 0, y: 0 }), 800);
        }

        if (Math.random() > 0.6) {
          setIsTalking(true);
          setTimeout(() => setIsTalking(false), Math.random() * 300 + 100);
        }
      }, 2000);

      return () => clearInterval(expressionInterval);
    }
  }, [typingComplete]);
  
  const handleNextClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4">
      <div className="relative w-64 h-64 mb-10">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-aegis-purple/40 to-transparent blur-xl animate-pulse"></div>
        <div className="absolute w-3/4 h-3/4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-aegis-purple/60 to-transparent blur-lg animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute w-1/2 h-1/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-aegis-purple/80 to-transparent blur-md animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        
        <div className="absolute w-full h-full flex items-center justify-center">
          <div className="relative w-20 h-20">

            <div 
              className={`absolute top-6 left-3 w-3 ${isBlinking ? 'h-[2px]' : 'h-[12px]'} bg-white rounded-full transition-all duration-100`}
              style={{ 
                transform: `translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                opacity: faceExpression === 'thoughtful' ? '0.9' : '1' 
              }}
            ></div>

            <div 
              className={`absolute top-6 right-3 w-3 ${isBlinking ? 'h-[2px]' : 'h-[12px]'} bg-white rounded-full transition-all duration-100`}
              style={{ 
                transform: `translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                opacity: faceExpression === 'thoughtful' ? '0.9' : '1' 
              }}
            ></div>

            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-150 bg-white"
              style={{ 
                width: isTalking ? '10px' : '12px', 
                height: isTalking ? '3px' : '6px',
                borderRadius: faceExpression === 'friendly' ? '0 0 100px 100px' : '100px',
                transform: `translateX(-50%) scale(${isTalking ? '0.9, 0.7' : '1, 1'})`,
                opacity: faceExpression === 'thoughtful' ? '0.8' : '1'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md mx-auto text-center mb-10">
        <h1 className="text-3xl font-medium text-aegis-purple mb-2">
          Aegis Security
        </h1>
        <p className="text-xl text-white min-h-[6rem] whitespace-pre-wrap">
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
      
      <p className="text-white/60 text-sm mt-6 text-center max-w-md">
        O Aegis utiliza criptografia avançada para proteger seus dados.
        Suas informações nunca são compartilhadas com terceiros.
      </p>
    </div>
  );
};

export default Welcome;