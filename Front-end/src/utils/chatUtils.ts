
import { MessageType } from '@/components/ChatMessage';

// Sample security insights
const securityInsights = [
  "Suas senhas devem ter pelo menos 12 caracteres e incluir letras maiúsculas, minúsculas, números e símbolos.",
  "Habilite a autenticação de dois fatores em todas as suas contas importantes para uma camada adicional de segurança.",
  "Verifique regularmente as permissões dos aplicativos em seus dispositivos e revogue acesso desnecessário.",
  "Use um gerenciador de senhas para criar e armazenar senhas fortes e únicas para cada conta.",
  "Mantenha seu software e sistemas operacionais atualizados para proteção contra vulnerabilidades conhecidas.",
  "Cuidado com e-mails de phishing. Verifique sempre o remetente e não clique em links suspeitos."
];

// Sample security tips - expanded list
const securityTips = [
  "Evite usar redes Wi-Fi públicas para acessar informações sensíveis ou fazer transações financeiras.",
  "Faça backup regular dos seus dados importantes em dispositivos offline ou serviços de nuvem criptografados.",
  "Use VPN ao navegar em redes públicas para proteger sua privacidade e dados.",
  "Verifique regularmente seus extratos bancários e de cartão de crédito para identificar transações suspeitas.",
  "Não compartilhe informações pessoais ou financeiras em resposta a e-mails, chamadas ou mensagens não solicitadas.",
  "Criptografe seus dispositivos para proteger seus dados caso eles sejam perdidos ou roubados.",
  "Desative Bluetooth e Wi-Fi quando não estiver usando para prevenir acesso não autorizado.",
  "Utilize bloqueadores de anúncios e extensões de privacidade em seus navegadores.",
  "Revise as configurações de privacidade em suas redes sociais regularmente.",
  "Use senhas diferentes para contas diferentes, principalmente para emails e bancos.",
  "Configure alertas de login para ser notificado quando alguém acessar suas contas.",
  "Baixe aplicativos apenas de lojas oficiais como Google Play e App Store.",
  "Desconfie de mensagens ou e-mails que criam senso de urgência ou pedidos incomuns.",
  "Ative o bloqueio automático de tela em seus dispositivos em caso de inatividade.",
  "Proteja seus documentos físicos com informações sensíveis em locais seguros.",
  "Use cartões virtuais ou temporários para compras online quando possível.",
  "Verifique se o site que você está visitando usa HTTPS (cadeado no navegador).",
  "Mantenha um software antivírus atualizado em todos os seus dispositivos.",
  "Desinfete seus dispositivos regularmente com softwares de limpeza confiáveis.",
  "Criptografe seus emails importantes com serviços de criptografia ponta a ponta.",
  "Utilize ferramentas de monitoramento dark web para detectar vazamentos das suas credenciais.",
  "Não deixe suas contas de redes sociais públicas se não for necessário.",
  "Evite clicar em anúncios ou pop-ups suspeitos durante navegação.",
  "Utilize autenticação biométrica quando disponível em seus dispositivos e aplicativos.",
  "Desative o rastreamento de localização em aplicativos que não precisam dessa informação."
];

// Response types based on user input keywords
const responsePatterns = [
  { keywords: ['senha', 'password', 'segura', 'forte'], type: 'tip' },
  { keywords: ['hacker', 'invasão', 'ataque'], type: 'insight' },
  { keywords: ['dica', 'conselho', 'ajuda', 'sugestão'], type: 'tip' },
  { keywords: ['phishing', 'email', 'golpe', 'fraude'], type: 'insight' },
  { keywords: ['virus', 'malware', 'proteção'], type: 'tip' },
  { keywords: ['privacidade', 'dados', 'informação'], type: 'insight' },
];

export interface BotResponse {
  text: string;
  type: MessageType;
}

export const generateBotResponse = (userInput: string): BotResponse => {
  // Convert input to lowercase for easier matching
  const lowerInput = userInput.toLowerCase();
  
  // Determine response type based on keywords
  let responseType: MessageType = 'bot';
  
  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(keyword => lowerInput.includes(keyword))) {
      responseType = pattern.type as MessageType;
      break;
    }
  }
  
  // Generate appropriate response
  let responseText = '';
  
  if (responseType === 'insight') {
    responseText = securityInsights[Math.floor(Math.random() * securityInsights.length)];
  } else if (responseType === 'tip') {
    responseText = securityTips[Math.floor(Math.random() * securityTips.length)];
  } else {
    // Use user's name if available
    const userProfile = localStorage.getItem('userProfile');
    let greeting = '';
    
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      greeting = `Olá ${profile.name}, `;
    }
    
    // Default response
    responseText = `${greeting}Posso ajudar com questões de segurança digital. Pergunte-me sobre senhas, proteção contra hackers, privacidade de dados ou outras preocupações de segurança!`;
  }
  
  return {
    text: responseText,
    type: responseType
  };
};

// Function to handle special action buttons
export const getSpecialContent = (actionType: 'insight' | 'tip'): string => {
  if (actionType === 'insight') {
    return securityInsights[Math.floor(Math.random() * securityInsights.length)];
  } else {
    return securityTips[Math.floor(Math.random() * securityTips.length)];
  }
};

// Messages for special button clicks
export const getActionMessages = (actionType: 'tips' | 'insights' | 'emergency'): string => {
  if (actionType === 'tips') {
    return "Acessando dicas úteis de segurança para você! Confira nossa página completa de dicas de cibersegurança.";
  } else if (actionType === 'insights') {
    return "Novos insights de segurança estão disponíveis para você agora!";
  } else if (actionType === 'emergency') {
    return "Alerta de emergência enviado! Um especialista da equipe Aegis entrará em contato com você em breve. Por favor, mantenha-se conectado.";
  }
  return "";
};

// New function to handle emergency button click
export const handleEmergencyContact = (): BotResponse => {
  return {
    text: "⚠️ CONTATO DE EMERGÊNCIA ATIVADO ⚠️\n\nUm especialista da equipe Aegis foi notificado e entrará em contato com você nos próximos instantes. Enquanto aguarda, você pode descrever brevemente a situação de emergência para que possamos encaminhar ao especialista correto.",
    type: 'insight'
  };
};
