
import React, { useState, useRef } from 'react';
import { X, Image, FileText, Film, FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MediaSelectorProps {
  onSelect: (file: File) => void;
  onClose: () => void;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({ onSelect, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelect(e.target.files[0]);
    }
  };
  
  const handleOptionClick = (type: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type;
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md bg-aegis-darker border border-aegis-purple/30 rounded-xl p-6 animate-in fade-in-50">
        <button 
          className="absolute top-3 right-3 text-white/70 hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-medium text-white mb-4">Adicionar Mídia</h3>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-colors ${dragActive ? 'border-aegis-purple bg-aegis-purple/10' : 'border-white/20 hover:border-aegis-purple/50 hover:bg-aegis-purple/5'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="w-12 h-12 text-aegis-purple mx-auto mb-2 opacity-70" />
          <p className="text-white mb-1">Arraste e solte um arquivo aqui ou</p>
          <p className="text-aegis-purple">clique para selecionar</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20 bg-aegis-purple/10 border-aegis-purple/20 hover:bg-aegis-purple/20"
            onClick={() => handleOptionClick('image/*')}
          >
            <Image className="w-5 h-5 text-aegis-purple mb-1" />
            <span className="text-xs text-white">Imagem</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20 bg-aegis-purple/10 border-aegis-purple/20 hover:bg-aegis-purple/20"
            onClick={() => handleOptionClick('application/pdf,text/*')}
          >
            <FileText className="w-5 h-5 text-aegis-purple mb-1" />
            <span className="text-xs text-white">Documento</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-20 bg-aegis-purple/10 border-aegis-purple/20 hover:bg-aegis-purple/20"
            onClick={() => handleOptionClick('video/*')}
          >
            <Film className="w-5 h-5 text-aegis-purple mb-1" />
            <span className="text-xs text-white">Vídeo</span>
          </Button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default MediaSelector;
