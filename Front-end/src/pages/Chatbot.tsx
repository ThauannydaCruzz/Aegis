
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle, 
  Info, 
  Shield, 
  Send, 
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ChatMessage from '@/components/ChatMessage';
import { useChat, MediaAttachment } from '@/contexts/ChatContext';
import { generateBotResponse, getSpecialContent, handleEmergencyContact } from '@/utils/chatUtils';
import MediaSelector from '@/components/MediaSelector';

const Chatbot = () => {
  const [greeting, setGreeting] = useState('');
  const [question, setQuestion] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // 1. Carrega nome do localStorage
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const { name } = JSON.parse(userProfile);
        setUserName(name || '');
      } catch (e) {
        console.error("Erro ao analisar userProfile", e);
        setUserName('');
      }
    }
  }, []);

  // 2. Só monta a saudação quando o nome estiver definido
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = "Olá";

    if (hour >= 5 && hour < 12) {
      timeGreeting = "Bom dia";
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = "Boa tarde";
    } else {
      timeGreeting = "Boa noite";
    }

    const fullGreeting = `${timeGreeting}${userName ? ', ' + userName : ''}`;
    setGreeting(fullGreeting);
  }, [userName]);

  // 3. Digita a pergunta só depois da saudação estar pronta
  useEffect(() => {
    if (!greeting) return;

    const fullQuestion = "Como posso ajudar você com sua segurança digital hoje?";
    setQuestion('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullQuestion.length) {
        setQuestion(prev => prev + fullQuestion.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowOptions(true);
          inputRef.current?.focus();
        }, 500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [greeting]);

  
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (file: File) => {
    setSelectedMedia(file);
    setMediaSelectorOpen(false);
    toast({
      title: "Arquivo selecionado",
      description: `${file.name} adicionado à mensagem`,
    });
  };

  const handleSendMessage = () => {
    if (userInput.trim() || selectedMedia) {
      let mediaAttachment: MediaAttachment | undefined;
      
      if (selectedMedia) {
        const url = URL.createObjectURL(selectedMedia);
        const fileType = selectedMedia.type.split('/')[0];
        
        mediaAttachment = {
          type: fileType === 'image' ? 'image' : 
                fileType === 'video' ? 'video' : 'document',
          url: url,
          name: selectedMedia.name
        };
      }
      
      addMessage(userInput, 'user', mediaAttachment);
      setUserInput('');
      setSelectedMedia(null);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = generateBotResponse(userInput);
        addMessage(response.text, response.type);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleInsightAction = () => {
    setInsightDialogOpen(true);
  };
  
  const handleEmergencyAction = () => {
    setEmergencyDialogOpen(true);
  };
  
  const confirmEmergencyAction = () => {
    setEmergencyDialogOpen(false);
    const response = handleEmergencyContact();
    addMessage(response.text, response.type);
    
    toast({
      title: "Contato de emergência",
      description: "Alerta enviado à equipe Aegis.",
      variant: "destructive"
    });
  };
  
  const handleSpecialAction = (type: 'insight' | 'tip') => {
    if (type === 'insight') {
      handleInsightAction();
      return;
    }
    
    if (type === 'tip') {
      addMessage("Você gostaria de acessar as dicas úteis de segurança?", 'bot');
      navigate('/aegis-team');
      return;
    }
    
    const content = getSpecialContent(type);
    addMessage(content, type);
    
    toast({
      title: type === 'insight' ? "Novo insight" : "Dica útil",
      description: "Informação de segurança adicionada ao chat.",
    });
  };
  
  const goToDashboard = () => {
    navigate('/security-dashboard');
  };
  
  const openMediaSelector = () => {
    setMediaSelectorOpen(true);
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-aegis-darker via-black to-aegis-dark flex flex-col relative overflow-hidden">
      {mediaSelectorOpen && (
        <MediaSelector 
          onSelect={handleFileSelect} 
          onClose={() => setMediaSelectorOpen(false)} 
        />
      )}
      
      <AlertDialog open={insightDialogOpen} onOpenChange={setInsightDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-aegis-purple/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Acesso aos Insights</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Você gostaria de acessar seus insights de segurança?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Não</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-aegis-purple hover:bg-purple-700 text-white" 
              onClick={goToDashboard}
            >
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Contato de Emergência
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Esta opção deve ser usada apenas em situações de emergência. Um especialista da equipe Aegis será notificado imediatamente.
              <br /><br />
              Deseja prosseguir com o contato de emergência?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={confirmEmergencyAction}
            >
              Contatar Equipe Aegis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-aegis-purple/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-aegis-purple/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="absolute top-6 right-6">
        <div className="w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center">
          <Shield className="w-4 h-4 text-aegis-purple" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-between p-6 z-10 max-w-md mx-auto w-full">
        <div className="w-full mt-6 text-center">
          <h1 className="text-2xl font-medium text-white">{greeting}</h1>
          <p className="text-aegis-purple/70 mt-1">Aegis Security ao seu dispor</p>
        </div>
        
        <div className="w-full flex-1 my-4 overflow-hidden">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <h2 className="text-3xl font-bold text-white mt-4">
                {question}
                <span className={`inline-block w-2 h-5 bg-white ml-1 ${question.length === 57 ? 'animate-pulse' : 'animate-[blink_1s_step-end_infinite]'}`}></span>
              </h2>
            </div>
          ) : (
            <ScrollArea ref={chatAreaRef} className="h-[calc(100vh-300px)] pr-4">
              <div className="flex flex-col space-y-4 pb-4">
                {messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id}
                    message={msg.text}
                    type={msg.type}
                    timestamp={msg.timestamp}
                    media={msg.media}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-white/50">
                    <div className="w-2 h-2 rounded-full bg-aegis-purple/50 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-aegis-purple/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-aegis-purple/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className={`w-full space-y-4 transition-all duration-500 ${showOptions || messages.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {messages.length === 0 && (
            <div className="mt-4 transition-opacity duration-500">
              <button 
                className="bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto backdrop-blur-md transition-all duration-300"
                onClick={openMediaSelector}
              >
                <PlusCircle className="w-6 h-6 text-aegis-purple" />
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="bg-aegis-purple/10 hover:bg-aegis-purple/20 border-aegis-purple/20 backdrop-blur-md h-24 flex flex-col items-center justify-center rounded-xl"
              onClick={() => handleSpecialAction('insight')}
            >
              <Info className="w-6 h-6 text-aegis-purple mb-2" />
              <span className="text-white text-sm">Insights</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20 backdrop-blur-md h-24 flex flex-col items-center justify-center rounded-xl"
              onClick={handleEmergencyAction}
            >
              <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
              <span className="text-white text-sm">Emergência</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-aegis-purple/10 hover:bg-aegis-purple/20 border-aegis-purple/20 backdrop-blur-md h-24 flex flex-col items-center justify-center rounded-xl"
              onClick={() => handleSpecialAction('tip')}
            >
              <Shield className="w-6 h-6 text-aegis-purple mb-2" />
              <span className="text-white text-sm">Dicas</span>
            </Button>
          </div>
          
          <div className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Digite sua mensagem aqui..."
              className="w-full bg-aegis-purple/10 hover:bg-aegis-purple/20 border-aegis-purple/20 backdrop-blur-md h-14 rounded-full pr-14 text-white placeholder:text-white/50"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            
            {selectedMedia && (
              <div className="absolute left-4 bottom-16 bg-aegis-purple/20 text-white text-xs py-1 px-3 rounded-full">
                {selectedMedia.name.length > 20 ? selectedMedia.name.substring(0, 20) + '...' : selectedMedia.name}
                <button 
                  className="ml-2 text-white/70 hover:text-white"
                  onClick={() => setSelectedMedia(null)}
                >
                  &times;
                </button>
              </div>
            )}
            
            {!selectedMedia && (
              <Button 
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-full bg-transparent hover:bg-aegis-purple/20"
                onClick={openMediaSelector}
                disabled={isTyping}
              >
                <PlusCircle className="w-5 h-5 text-aegis-purple" />
              </Button>
            )}
            
            <Button 
              variant="ghost"
              size="icon"
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-full ${isTyping ? 'bg-gray-500/50' : 'bg-gradient-to-br from-aegis-purple to-purple-500 hover:opacity-90'}`}
              onClick={handleSendMessage}
              disabled={isTyping}
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
