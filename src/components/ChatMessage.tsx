
import React from 'react';
import { Info, Shield, Sparkles, FileText, Image as ImageIcon, Film, Download } from 'lucide-react';
import { MediaAttachment } from '@/contexts/ChatContext';

export type MessageType = 'user' | 'bot' | 'insight' | 'tip';

export interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp: Date;
  media?: MediaAttachment;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type, timestamp, media }) => {
  const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderMedia = () => {
    if (!media) return null;
    
    switch (media.type) {
      case 'image':
        return (
          <div className="mt-2 rounded-md overflow-hidden max-w-full">
            <img 
              src={media.url} 
              alt={media.name} 
              className="max-w-full max-h-[200px] object-contain"
            />
          </div>
        );
      case 'document':
        return (
          <a 
            href={media.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 flex items-center p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
          >
            <FileText className="w-5 h-5 text-aegis-purple mr-2" />
            <span className="text-sm text-white truncate">{media.name}</span>
            <Download className="w-4 h-4 text-white/70 ml-auto" />
          </a>
        );
      case 'video':
        return (
          <div className="mt-2 rounded-md overflow-hidden">
            <video 
              src={media.url} 
              controls 
              className="max-w-full max-h-[200px]"
            >
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        );
      default:
        return null;
    }
  };

  if (type === 'user') {
    return (
      <div className="flex flex-col items-end mb-4">
        <div className="bg-aegis-purple rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] break-words">
          <p className="text-white">{message}</p>
          {renderMedia()}
        </div>
        <span className="text-xs text-white/50 mt-1">{time}</span>
      </div>
    );
  }

  let icon = <Sparkles className="w-4 h-4 text-aegis-purple" />;
  let bgColor = "bg-white/10";
  
  if (type === 'insight') {
    icon = <Info className="w-4 h-4 text-aegis-purple" />;
    bgColor = "bg-aegis-purple/10";
  } else if (type === 'tip') {
    icon = <Shield className="w-4 h-4 text-aegis-purple" />;
    bgColor = "bg-aegis-purple/10";
  }

  return (
    <div className="flex flex-col items-start mb-4">
      <div className={`flex items-start ${bgColor} backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] break-words`}>
        <div className="mr-2 mt-1">{icon}</div>
        <div>
          <p className="text-white">{message}</p>
          {renderMedia()}
        </div>
      </div>
      <span className="text-xs text-white/50 mt-1">{time}</span>
    </div>
  );
};

export default ChatMessage;
