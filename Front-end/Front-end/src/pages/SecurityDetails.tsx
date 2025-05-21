
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  Download,
  Filter,
  MapPin,
  Shield,
  Terminal,
  Clock,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Type for security events
interface SecurityEvent {
  id: number;
  date: string;
  time: string;
  event: string;
  device: string;
  location: string;
  ip: string;
  severity: 'high' | 'medium' | 'low'; // Add severity property
}

const SecurityDetails = () => {
  const navigate = useNavigate();
  
  const [profile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'Usuário',
      role: 'Especialista em Segurança',
      avatar: ''
    };
  });

  // Security events data - with severity property added
  const securityEvents: SecurityEvent[] = [
    {
      id: 1,
      date: '05/05/2025',
      time: '08:32',
      event: 'Login bem-sucedido',
      device: 'MacBook Pro',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.218',
      severity: 'low'
    },
    {
      id: 2,
      date: '02/05/2025',
      time: '14:15',
      event: 'Senha alterada',
      device: 'iPhone 15',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.218',
      severity: 'low'
    },
    {
      id: 3,
      date: '30/04/2025',
      time: '19:45',
      event: 'Tentativa de login incomum',
      device: 'Dispositivo desconhecido',
      location: 'Singapura',
      ip: '103.56.115.89',
      severity: 'high'
    },
    {
      id: 4,
      date: '28/04/2025',
      time: '11:03',
      event: 'Novo dispositivo autorizado',
      device: 'Samsung Galaxy S24',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.220',
      severity: 'medium'
    },
    {
      id: 5,
      date: '22/04/2025',
      time: '16:28',
      event: 'Autenticação de dois fatores ativada',
      device: 'MacBook Pro',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.218',
      severity: 'low'
    },
    {
      id: 6,
      date: '18/04/2025',
      time: '09:12',
      event: 'E-mail de recuperação atualizado',
      device: 'MacBook Pro',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.218',
      severity: 'medium'
    },
    {
      id: 7,
      date: '15/04/2025',
      time: '22:56',
      event: 'Tentativa de acesso à API',
      device: 'Dispositivo desconhecido',
      location: 'Kiev, Ucrânia',
      ip: '92.114.64.112',
      severity: 'high'
    },
    {
      id: 8,
      date: '12/04/2025',
      time: '15:30',
      event: 'Senha de aplicativo criada',
      device: 'MacBook Pro',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.218',
      severity: 'low'
    },
    {
      id: 9,
      date: '10/04/2025',
      time: '10:44',
      event: 'Permissões de aplicativo revisadas',
      device: 'iPhone 15',
      location: 'São Paulo, Brasil',
      ip: '177.92.64.218',
      severity: 'low'
    },
    {
      id: 10,
      date: '05/04/2025',
      time: '17:22',
      event: 'Login após longo período',
      device: 'Windows PC',
      location: 'Rio de Janeiro, Brasil',
      ip: '201.17.89.72',
      severity: 'medium'
    }
  ];

  // Security metrics data
  const securityMetrics = [
    { label: 'Pontuação Geral', value: 78, maxValue: 100, color: 'bg-emerald-500' },
    { label: 'Força da Senha', value: 85, maxValue: 100, color: 'bg-aegis-teal' },
    { label: 'Autenticação', value: 75, maxValue: 100, color: 'bg-blue-500' },
    { label: 'Atividade de Login', value: 65, maxValue: 100, color: 'bg-amber-500' },
  ];

  // State for filter by severity
  const [isOpenSeverity, setIsOpenSeverity] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  // Filter events based on selected severity
  const filteredEvents = selectedSeverity 
    ? securityEvents.filter(event => event.severity === selectedSeverity)
    : securityEvents;

  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-darker via-black to-aegis-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button and profile */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 text-white"
              onClick={() => navigate('/security-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Detalhes de Segurança</h1>
          </div>
          
          <div className="flex items-center gap-3">
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
        <div className="max-w-6xl mx-auto">
          {/* Security Score Overview */}
          <Card className="mb-8 bg-gradient-to-br from-aegis-dark to-black border-aegis-purple/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 text-aegis-purple mr-2" />
                Visão Geral da Segurança
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {securityMetrics.map((metric, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-2">{metric.label}</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <span className="text-xs text-gray-400">/{metric.maxValue}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${metric.color}`} 
                        style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different security views */}
          <Tabs defaultValue="activity" className="mb-8">
            <TabsList className="bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="activity" className="data-[state=active]:bg-aegis-purple/20">
                <Activity className="h-4 w-4 mr-2" />
                Atividade
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-aegis-purple/20">
                <Shield className="h-4 w-4 mr-2" />
                Recomendações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="mt-4">
              <Card className="bg-gradient-to-br from-aegis-dark to-black border-aegis-purple/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Histórico de Segurança</CardTitle>
                    
                    <div className="flex space-x-2">
                      {/* Filter by severity */}
                      <Collapsible
                        open={isOpenSeverity}
                        onOpenChange={setIsOpenSeverity}
                        className="relative"
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-black/20 border-gray-700">
                            <Filter className="h-4 w-4 mr-2" />
                            {selectedSeverity ? `Severidade: ${selectedSeverity}` : 'Filtrar'}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="absolute right-0 mt-2 w-48 z-10 bg-gray-900 border border-gray-800 rounded-md p-2 shadow-lg">
                          <div className="space-y-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedSeverity(null)}
                            >
                              Todos
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedSeverity('high')}
                            >
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                              Alta
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedSeverity('medium')}
                            >
                              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                              Média
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedSeverity('low')}
                            >
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              Baixa
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      
                      <Button variant="outline" size="sm" className="bg-black/20 border-gray-700">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mt-2">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="flex flex-col md:flex-row md:items-center p-3 bg-black/30 hover:bg-black/40 rounded-lg transition-colors border border-gray-800/50"
                      >
                        <div className="flex items-center mb-2 md:mb-0 md:mr-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                            event.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            event.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {event.severity === 'high' ? <AlertCircle className="h-5 w-5" /> :
                             event.severity === 'medium' ? <Terminal className="h-5 w-5" /> :
                             <CheckCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium">{event.event}</p>
                            <div className="flex items-center text-xs text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {event.date}
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              {event.time}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-0 md:ml-auto flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-gray-800 rounded-full flex items-center">
                            <Smartphone className="h-3 w-3 mr-1" />
                            {event.device}
                          </span>
                          <span className="px-2 py-1 bg-gray-800 rounded-full flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </span>
                          <span className="px-2 py-1 bg-gray-800 rounded-full">
                            IP: {event.ip}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4">
              <Card className="bg-gradient-to-br from-aegis-dark to-black border-aegis-purple/20">
                <CardHeader>
                  <CardTitle className="text-xl">Recomendações de Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Habilite autenticação em dois fatores',
                        description: 'Adicione uma camada extra de segurança com autenticação de dois fatores em todas as suas contas.',
                        priority: 'Alta'
                      },
                      {
                        title: 'Atualize suas senhas',
                        description: 'Recomendamos atualizar senhas que não são alteradas há mais de 3 meses.',
                        priority: 'Média'
                      },
                      {
                        title: 'Verifique aplicativos conectados',
                        description: 'Você tem 12 aplicativos conectados à sua conta. Revise as permissões para garantir segurança.',
                        priority: 'Média'
                      },
                      {
                        title: 'Configure perguntas de recuperação',
                        description: 'Adicione perguntas de segurança para recuperação de conta em caso de perda de acesso.',
                        priority: 'Baixa'
                      },
                    ].map((recommendation, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-black/30 hover:bg-black/40 rounded-lg transition-colors border border-gray-800/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{recommendation.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            recommendation.priority === 'Alta' ? 'bg-red-500/20 text-red-400' :
                            recommendation.priority === 'Média' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            Prioridade {recommendation.priority}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{recommendation.description}</p>
                        <div className="mt-3">
                          <Button variant="outline" size="sm" className="bg-aegis-purple/10 border-aegis-purple/30 hover:bg-aegis-purple/20">
                            Implementar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SecurityDetails;
