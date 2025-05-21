import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, ArrowLeft, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const teamMembers = [
  { 
    name: "Alecsandro", 
    initials: "AL", 
    role: "Analista de Cibersegurança",
    description: "Foco em análise e coleta de dados sobre vulnerabilidades em cibersegurança, com contribuições no desenvolvimento de chatbots e reconhecimento facial.",
    linkedin: "https://www.linkedin.com/in/alecsandrocostasantos?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/alecsandro_aleck?igsh=MWEwb2Z0dGdza2tkZw==",
    whatsapp: "+5514996791259"
  },
  { 
    name: "Ana Júlia Romera", 
    initials: "AJR", 
    role: "Especialista em Segurança",
    description: "Desenvolvedora de soluções em reconhecimento facial, responsável por estratégias e implementaçãos de segurança em tecnologias.",
    linkedin: "https://www.linkedin.com/in/ana-j%C3%BAlia-pereira-romera?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/anajulia_romera?igsh=MmlmMnYyMTV0NDFr",
    whatsapp: "+5514998714623"
  },
  { 
    name: "Gabriela Akemi", 
    initials: "GA", 
    role: "UI/UX Designer e Desenvolvedora",
    description: "Desenvolvedora full stack com contribuições no design UI/UX, desenvolvimento frontend e integração com o backend.",
    linkedin: "https://linkedin.com/in/gabrielaakemi",
    instagram: "https://instagram.com/gabrielaakemi",
    whatsapp: "+5511999999999"
  },
  { 
    name: "Nadine Castro", 
    initials: "NC", 
    role: "Pesquisadora",
    description: "Pesquisadora com foco em pesquisas aplicadas ao aprimoramento de chatbots, suas tecnologias e aplicações práticas em segurança.",
    linkedin: "https://www.linkedin.com/in/nadine-schimidt-1bb2b8312?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/schimidtnadine?igsh=NDg0Nzd5djdmMmR6",
    whatsapp: "+5514997927698"
  },
  { 
    name: "Renan Hikaru", 
    initials: "RH", 
    role: "Especialista em Cibersegurança",
    description: "Foco em soluções de coleta de dados em cibersegurança e pesquisas voltadas à segurança da informação e tecnologias conversacionais.",
    linkedin: "http://www.linkedin.com/in/renan-hikaru-a57294289",
    instagram: "https://www.instagram.com/ctr1_a1tdel/",
    whatsapp: "+5514996353525"
  },
  { 
    name: "Sophia Mattos", 
    initials: "SM", 
    role: "Desenvolvedora em Visão Computacional",
    description: "Atuação em pesquisas e testes voltados ao reconhecimento facial, explorando estratégias de funcionamento e validação da tecnologia.",
    linkedin: "https://www.instagram.com/sophiaamattos_/",
    instagram: "https://www.linkedin.com/in/mattos-sophia/",
    whatsapp: "+5514997114579"
  },
  { 
    name: "Thauanny da Cruz", 
    initials: "TC", 
    role: "Desenvolvedora de Interfaces Web",
    description: "Responsável pela implementação do frontend do website, com atuação estratégica no design de interface e elaboração de soluções visuais",
    linkedin: "https://www.instagram.com/thaucrz?igsh=M3M1ZDM1MnB2anRh",
    instagram: "https://www.linkedin.com/in/thauannydacruz?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    whatsapp: "+5514996609040"
  },
  { 
    name: "Vinicius Cristino", 
    initials: "VC", 
    role: "Pesquisador",
    description: "Foco na análise e desenvolvimento de tecnologias conversacionais, com ênfase em chatbots, suas aplicações e tecnologias subjacentes.",
    linkedin: "https://br.linkedin.com/in/vin%C3%ADcius-cristino-687194197",
    instagram: "https://www.instagram.com/vinicristinno/",
    whatsapp: "+5514998288425"
  },
];

const securityTips = [
  {
    title: "Senhas Fortes",
    description: "Use senhas complexas com pelo menos 12 caracteres, combinando letras maiúsculas, minúsculas, números e símbolos especiais.",
    resourceUrl: "https://www.gov.br/defesa/pt-br/arquivos/seguranca_e_defesa/seguranca_da_informacao/guia_boas_praticas_para_elaborar_senhas_seguras.pdf"
  },
  {
    title: "Autenticação de Dois Fatores",
    description: "Ative a autenticação de dois fatores em todas as suas contas para adicionar uma camada extra de segurança.",
    resourceUrl: "https://support.google.com/accounts/answer/185839?hl=pt-BR&co=GENIE.Platform%3DDesktop"
  },
  {
    title: "Atualizações de Software",
    description: "Mantenha seu sistema operacional e aplicativos sempre atualizados para corrigir vulnerabilidades de segurança.",
    resourceUrl: "https://cartilha.cert.br/computadores/"
  },
  {
    title: "Phishing",
    description: "Desconfie de e-mails, mensagens ou links suspeitos. Nunca compartilhe informações sensíveis através de canais não verificados.",
    resourceUrl: "https://seguranca.uol.com.br/antivirus/dicas/curiosidades/o-que-e-phishing-e-como-evitar-esse-tipo-de-golpe.html"
  },
  {
    title: "Backup de Dados",
    description: "Faça backup regular dos seus dados importantes em dispositivos offline ou serviços em nuvem criptografados.",
    resourceUrl: "https://www.gta.ufrj.br/ensino/eel878/redes1-2018-1/trabalhos-v1/backup/"
  },
  {
    title: "Redes Wi-Fi Públicas",
    description: "Evite acessar informações sensíveis ou realizar transações financeiras em redes Wi-Fi públicas. Use uma VPN quando necessário.",
    resourceUrl: "https://www.cert.br/docs/palestras/certbr-nic-br-internet-segura-2019.pdf"
  },
  {
    title: "Verificação de Extensões",
    description: "Instale apenas extensões de navegador de fontes confiáveis e verifique as permissões que elas solicitam.",
    resourceUrl: "https://support.google.com/chrome/answer/2811969?hl=pt-BR&co=GENIE.Platform%3DDesktop"
  },
  {
    title: "Gerenciadores de Senha",
    description: "Use um gerenciador de senhas confiável para criar e armazenar senhas fortes e únicas para cada serviço.",
    resourceUrl: "https://www.kaspersky.com.br/blog/the-wonders-of-password-managers/14043/"
  },
  {
    title: "Criptografia de Dispositivos",
    description: "Ative a criptografia de dados em todos os seus dispositivos para proteger suas informações em caso de perda ou roubo.",
    resourceUrl: "https://support.microsoft.com/pt-br/windows/ativar-a-criptografia-de-dispositivo-0c453637-bc88-5f74-5105-741561aae838"
  }
];

const AegisTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const showTipToast = (tipTitle) => {
    toast({
      title: "Redirecionando...",
      description: `Acessando mais informações sobre ${tipTitle}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-darker via-black to-aegis-dark overflow-x-hidden">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8 text-white hover:bg-white/10"
          onClick={() => navigate('/chatbot')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Chat
        </Button>

        {/* Header */}
        <div className="flex items-center justify-center mb-12">
          <Shield className="h-8 w-8 text-aegis-purple mr-3" />
          <h1 className="text-3xl font-bold text-white">Aegis Security</h1>
        </div>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3 animate-fade-in">
              Contate a <span className="text-aegis-purple">equipe Aegis</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Nossa equipe de especialistas em segurança está pronta para proteger seus dados e sistemas contra ameaças cibernéticas.
            </p>
          </div>

          <div className="mt-10 relative">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="p-1">
                      <Card className="bg-gray-900/70 border-aegis-purple/20 backdrop-blur-md overflow-hidden hover:border-aegis-purple/60 transition-all duration-300 group h-full">
                        <CardContent className="p-6 flex flex-col items-center">
                          <div className="mb-5 relative">
                            <div className="absolute inset-0 bg-aegis-purple/20 rounded-full animate-pulse group-hover:animate-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Avatar className="h-28 w-28 border-2 border-aegis-purple/50 group-hover:border-aegis-purple transition-all duration-300 shadow-xl shadow-aegis-purple/20">
                              <AvatarFallback className="bg-aegis-purple/30 text-white text-2xl font-medium">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <h3 className="font-medium text-white text-xl mb-1 group-hover:text-aegis-purple transition-colors duration-300">{member.name}</h3>
                          <p className="text-aegis-purple/80 text-sm mb-3">{member.role}</p>
                          
                          {/* Description */}
                          <p className="text-gray-300 text-sm text-center mb-4">{member.description}</p>
                          
                          {/* Social Media Links */}
                          <div className="flex justify-center gap-3 mt-2">
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" 
                              className="p-2 rounded-full bg-aegis-purple/20 hover:bg-aegis-purple/40 transition-colors duration-200 text-white">
                              <Linkedin size={18} />
                            </a>
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer" 
                              className="p-2 rounded-full bg-aegis-purple/20 hover:bg-aegis-purple/40 transition-colors duration-200 text-white">
                              <Instagram size={18} />
                            </a>
                            <a href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" 
                              className="p-2 rounded-full bg-aegis-purple/20 hover:bg-aegis-purple/40 transition-colors duration-200 text-white">
                              <MessageCircle size={18} />
                            </a>
                          </div>
                          
                          <div className="mt-4">
                            <Button variant="ghost" size="sm" className="text-xs text-white/70 hover:text-white hover:bg-aegis-purple/20">
                              Entre em contato
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-6">
                <CarouselPrevious className="relative static left-0 translate-y-0 bg-aegis-purple/10 hover:bg-aegis-purple/30 border-aegis-purple/30" />
                <CarouselNext className="relative static right-0 translate-y-0 bg-aegis-purple/10 hover:bg-aegis-purple/30 border-aegis-purple/30" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Security Tips Section */}
        <section>
          <div className="flex items-center mb-8 justify-center">
            <Shield className="h-6 w-6 text-aegis-purple mr-2" />
            <h2 className="text-2xl font-semibold text-white">Dicas úteis de segurança</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityTips.map((tip, index) => (
              <Card key={index} className="bg-gray-900/70 border-aegis-purple/20 backdrop-blur-md hover:border-aegis-purple/40 transition-all hover:-translate-y-1 duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-aegis-purple/20 flex items-center justify-center mr-3">
                      <span className="text-aegis-purple font-semibold">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-white">{tip.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{tip.description}</p>
                  <a 
                    href={tip.resourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="link" 
                      className="text-aegis-purple mt-3 p-0" 
                      onClick={() => showTipToast(tip.title)}
                    >
                      Saiba mais
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-400 text-sm">
          <p>© 2025 Aegis Security. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default AegisTeam;
