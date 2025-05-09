
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Shield, 
  ArrowLeft,
  CreditCard, 
  PieChart, 
  BarChart3, 
  Bell, 
  Lock, 
  User
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const SecurityDashboard = () => {
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'Usuário',
      role: 'Especialista em Segurança',
      avatar: ''
    };
  });
  
  const navigate = useNavigate();
  
  const goToProfileEdit = () => {
    navigate('/profile-edit');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-darker via-black to-aegis-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 text-white"
              onClick={() => navigate('/chatbot')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>Security Dashboard</h1>
          </div>
          
          {/* Profile section - make clickable */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={goToProfileEdit}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white font-medium">{profile.name}</p>
              <p className="text-xs text-gray-400">{profile.role}</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-aegis-purple/50">
              {profile.avatar ? (
                <AvatarImage src={profile.avatar} alt={profile.name} />
              ) : (
                <AvatarFallback className="bg-aegis-purple/30 text-white">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </header>
        
        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2 text-white`}>Meu Dashboard</h1>
          <p className="text-gray-400 mb-8">Visão geral da sua segurança digital</p>
          
          {/* Security Score Card */}
          <Card className="mb-8 bg-gradient-to-br from-emerald-400/20 to-emerald-600/5 border-emerald-500/20">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-white mb-1`}>Score de Segurança</h2>
                  <p className="text-emerald-400 text-sm">+12% desde o último mês</p>
                </div>
                <div className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-white`}>78<span className={`${isMobile ? 'text-xl' : 'text-2xl'} text-emerald-400`}>/100</span></div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-6 w-full h-3 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="mt-4 grid grid-cols-1">
                <Button 
                  variant="outline" 
                  className="bg-black/10 border-white/10 text-white"
                  onClick={() => navigate('/security-details')}
                >
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main cards grid */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'} mb-8`}>
            {/* Protected Accounts */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-white`}>Contas Protegidas</CardTitle>
                <Lock className="h-5 w-5 text-aegis-purple" />
              </CardHeader>
              <CardContent className="p-4">
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                  {['Google', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Banco'].map((account, index) => (
                    <div key={index} className="flex items-center p-2 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-aegis-purple/20 flex items-center justify-center mr-2">
                        <span className="text-aegis-purple font-medium">{account[0]}</span>
                      </div>
                      <span className="text-sm text-white">{account}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Vulnerability Chart */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-white`}>Análise de Vulnerabilidades</CardTitle>
                <PieChart className="h-5 w-5 text-aegis-teal" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative">
                  {/* Simplified donut chart */}
                  <div className={`${isMobile ? 'w-36 h-36' : 'w-48 h-48'} mx-auto mb-4 rounded-full border-[16px] border-aegis-teal/80 relative`}>
                    <div className="absolute inset-0 rounded-full border-[16px] border-r-aegis-purple border-t-aegis-purple border-l-transparent border-b-transparent"></div>
                    <div className="absolute inset-4 rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>73%</div>
                        <div className="text-xs text-gray-400">Resolvidas</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-aegis-teal mr-2"></div>
                      <span className="text-sm text-white">Resolvidas (73%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-aegis-purple mr-2"></div>
                      <span className="text-sm text-white">Pendentes (27%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Security Incidents */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-white`}>Incidentes de Segurança</CardTitle>
                <Bell className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {[
                    { date: '14/04', text: 'Tentativa de login incomum', level: 'high' },
                    { date: '10/04', text: 'E-mail de phishing detectado', level: 'medium' },
                    { date: '02/04', text: 'Senha fraca alterada', level: 'low' }
                  ].map((incident, index) => (
                    <div key={index} className="flex items-center p-2 bg-black/20 rounded-lg">
                      <div className={`min-w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        incident.level === 'high' ? 'bg-red-500/20 text-red-500' :
                        incident.level === 'medium' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        <span className="text-xs font-medium">{incident.date}</span>
                      </div>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-white`}>{incident.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Security Activity */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-white`}>Atividade de Segurança</CardTitle>
                <BarChart3 className="h-5 w-5 text-aegis-teal" />
              </CardHeader>
              <CardContent className="p-4">
                <div className={`flex h-${isMobile ? '32' : '40'} items-end space-x-2`}>
                  {[30, 45, 25, 60, 75, 40, 50].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-aegis-purple to-aegis-teal rounded-t-sm" 
                        style={{ height: `${value}%` }}
                      ></div>
                      <span className="text-xs mt-1 text-white">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-400">
                  <span>Atividade semanal</span>
                  <span>53 eventos totais</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recommendations */}
          <div className="mb-8">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4 text-white`}>Recomendações de Segurança</h2>
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-4`}>
              {[
                { title: 'Habilite 2FA', desc: 'Em todas as suas contas importantes' },
                { title: 'Atualize senhas', desc: 'Algumas senhas estão desatualizadas' },
                { title: 'Verificar privacidade', desc: 'Configurações de redes sociais' }
              ].map((item, index) => (
                <Card key={index} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecurityDashboard;
