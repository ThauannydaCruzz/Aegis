
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Edit, Link as LinkIcon, Phone, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  role: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  avatar: string;
  skills: string[];
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuário',
    role: 'Especialista em Segurança',
    location: 'São Paulo, Brasil',
    website: '',
    phone: '',
    email: '',
    avatar: '',
    skills: ['Segurança Digital', 'Criptografia']
  });
  
  // Carregar dados do perfil se existirem
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const userEmail = localStorage.getItem('userEmail');
    
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(current => ({
        ...current,
        ...parsedProfile
      }));
    } else if (userEmail) {
      // Se não tiver perfil completo mas tiver email
      setProfile(current => ({
        ...current,
        email: userEmail
      }));
    }
  }, []);
  
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: "Perfil Atualizado",
      description: "Suas informações foram salvas com sucesso!",
    });
    navigate('/security-dashboard');
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(newSkill.trim())) {
        setProfile(prev => ({ 
          ...prev, 
          skills: [...prev.skills, newSkill.trim()] 
        }));
        setNewSkill('');
      }
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-aegis-darker via-black to-aegis-dark flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-6"
          onClick={() => navigate('/security-dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
        </Button>
        
        {/* Header gradient card */}
        <div className="relative overflow-hidden w-full h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-t-xl">
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="bg-aegis-dark border border-aegis-purple/20 rounded-b-xl p-6 relative">
          {/* Avatar that overlaps with header */}
          <div className="absolute -top-16 left-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-aegis-dark">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-aegis-purple/30 text-white text-4xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                <Edit className="h-6 w-6 text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="pt-20">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nome</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleChange}
                    className="bg-aegis-purple/10 border-aegis-purple/20 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role" className="text-white">Função</Label>
                  <Input 
                    id="role" 
                    name="role" 
                    value={profile.role} 
                    onChange={handleChange}
                    className="bg-aegis-purple/10 border-aegis-purple/20 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-white">Localização</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={profile.location} 
                    onChange={handleChange}
                    className="bg-aegis-purple/10 border-aegis-purple/20 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="website" className="text-white">Website</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-aegis-purple/50 h-4 w-4" />
                    <Input 
                      id="website" 
                      name="website" 
                      value={profile.website} 
                      onChange={handleChange}
                      className="bg-aegis-purple/10 border-aegis-purple/20 text-white pl-10"
                      placeholder="https://seusite.com"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Label htmlFor="phone" className="text-white">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-aegis-purple/50 h-4 w-4" />
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={profile.phone} 
                      onChange={handleChange}
                      className="bg-aegis-purple/10 border-aegis-purple/20 text-white pl-10"
                      placeholder="+55 (00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-aegis-purple/50 h-4 w-4" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={handleChange}
                      className="bg-aegis-purple/10 border-aegis-purple/20 text-white pl-10"
                      placeholder="nome@exemplo.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Label htmlFor="skills" className="text-white">Competências</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-aegis-purple/20 text-white px-3 py-1 rounded-full flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-white/70 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div className="relative inline-flex">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Adicionar competência..."
                    className="bg-aegis-purple/10 border-aegis-purple/20 text-white min-w-48"
                  />
                </div>
              </div>
              <p className="text-white/50 text-xs mt-1">
                Pressione Enter para adicionar uma competência
              </p>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                type="submit"
                className="bg-aegis-purple hover:bg-purple-700 text-white"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
