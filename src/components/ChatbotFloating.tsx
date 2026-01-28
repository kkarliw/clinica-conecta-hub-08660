import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Calendar, Stethoscope, Clock, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: any;
}

// Medical FAQ knowledge base
const medicalFAQ = {
  keywords: {
    cita: {
      response: "Para agendar una cita médica, puedes:\n\n1. **Iniciar sesión** en tu cuenta de paciente\n2. Ir a la sección **'Mis Citas'**\n3. Seleccionar el **especialista** y **horario** disponible\n\n¿Te gustaría que te guíe al proceso de registro?",
      actions: [
        { label: "Iniciar sesión", action: "login", icon: User },
        { label: "Registrarme", action: "register", icon: ArrowRight }
      ]
    },
    horario: {
      response: "Nuestros horarios de atención son:\n\n🕐 **Lunes a Viernes:** 7:00 AM - 7:00 PM\n🕐 **Sábados:** 8:00 AM - 2:00 PM\n🕐 **Domingos:** Solo urgencias\n\nLas citas de telemedicina están disponibles 24/7.",
      actions: [
        { label: "Ver especialistas", action: "specialists", icon: Stethoscope },
        { label: "Agendar cita", action: "appointment", icon: Calendar }
      ]
    },
    especialidad: {
      response: "Contamos con las siguientes especialidades:\n\n• Medicina General\n• Pediatría\n• Ginecología\n• Cardiología\n• Dermatología\n• Psicología\n• Nutrición\n• Odontología\n\n¿Qué especialidad te interesa?",
      actions: [
        { label: "Medicina General", action: "general", icon: Heart },
        { label: "Ver todas", action: "all_specialists", icon: Stethoscope }
      ]
    },
    precio: {
      response: "Nuestros planes de atención:\n\n💎 **Consulta General:** Desde $50.000 COP\n💎 **Especialidades:** Desde $80.000 COP\n💎 **Telemedicina:** Desde $35.000 COP\n\nAceptamos múltiples métodos de pago y convenios con EPS.",
      actions: [
        { label: "Contactar ventas", action: "contact", icon: MessageCircle }
      ]
    },
    historia: {
      response: "Tu **historia clínica digital** está siempre disponible:\n\n📋 Accede desde cualquier dispositivo\n🔒 100% segura y encriptada\n📄 Descarga en PDF cuando lo necesites\n\nInicia sesión para acceder a tu historial médico.",
      actions: [
        { label: "Iniciar sesión", action: "login", icon: User }
      ]
    },
    telemedicina: {
      response: "Nuestra plataforma de **Telemedicina** te permite:\n\n📹 Consultas por videollamada HD\n💬 Chat en tiempo real con tu médico\n📝 Recetas digitales válidas\n🕐 Disponible 24/7\n\n¿Te gustaría agendar una consulta virtual?",
      actions: [
        { label: "Agendar teleconsulta", action: "telemedicine", icon: Calendar }
      ]
    },
    urgencia: {
      response: "⚠️ **En caso de emergencia:**\n\n🚨 Llama al **123** (Línea de emergencias)\n🏥 Acude al hospital más cercano\n📞 Nuestra línea de urgencias: **01 800 123 4567**\n\nPara situaciones no urgentes, agenda una cita regular.",
      actions: [
        { label: "Contacto urgente", action: "urgent_contact", icon: Clock }
      ]
    },
    registro: {
      response: "Registrarte en Kenkō es muy fácil:\n\n1. Haz clic en **'Registrarse'**\n2. Selecciona tu **tipo de cuenta** (Paciente, Médico, etc.)\n3. Completa tus **datos personales**\n4. ¡Listo! Ya puedes agendar citas\n\n¿Deseas registrarte ahora?",
      actions: [
        { label: "Registrarme ahora", action: "register", icon: ArrowRight }
      ]
    },
    kenko: {
      response: "**Kenkō** (健康) significa 'salud' en japonés 🌸\n\nSomos una plataforma integral de gestión médica que conecta pacientes con profesionales de la salud. Nuestra misión es hacer la atención médica más accesible y eficiente.\n\n✨ +500 profesionales\n✨ +50,000 pacientes atendidos\n✨ 99.9% de satisfacción",
      actions: [
        { label: "Conocer más", action: "about", icon: Heart }
      ]
    }
  },
  default: {
    response: "¡Hola! Soy el asistente virtual de **Kenkō** 🏥\n\nPuedo ayudarte con:\n\n• Información sobre citas y horarios\n• Especialidades médicas disponibles\n• Precios y planes de atención\n• Telemedicina y consultas virtuales\n• Tu historia clínica\n\n¿En qué puedo ayudarte hoy?",
    actions: [
      { label: "Agendar cita", action: "appointment", icon: Calendar },
      { label: "Ver especialidades", action: "specialists", icon: Stethoscope },
      { label: "Iniciar sesión", action: "login", icon: User }
    ]
  }
};

function findResponse(input: string): { response: string; actions?: QuickAction[] } {
  const lowerInput = input.toLowerCase();
  
  for (const [keyword, data] of Object.entries(medicalFAQ.keywords)) {
    if (lowerInput.includes(keyword)) {
      return data;
    }
  }
  
  // Additional keyword matching
  if (lowerInput.includes('doctor') || lowerInput.includes('médico') || lowerInput.includes('medico')) {
    return medicalFAQ.keywords.especialidad;
  }
  if (lowerInput.includes('agendar') || lowerInput.includes('reservar') || lowerInput.includes('consulta')) {
    return medicalFAQ.keywords.cita;
  }
  if (lowerInput.includes('precio') || lowerInput.includes('costo') || lowerInput.includes('valor') || lowerInput.includes('cuanto')) {
    return medicalFAQ.keywords.precio;
  }
  if (lowerInput.includes('emergencia') || lowerInput.includes('urgente')) {
    return medicalFAQ.keywords.urgencia;
  }
  if (lowerInput.includes('virtual') || lowerInput.includes('online') || lowerInput.includes('video')) {
    return medicalFAQ.keywords.telemedicina;
  }
  if (lowerInput.includes('hola') || lowerInput.includes('ayuda') || lowerInput.includes('info')) {
    return medicalFAQ.default;
  }
  
  return {
    response: "Gracias por tu mensaje. Para brindarte mejor atención, ¿podrías especificar si necesitas información sobre:\n\n• **Citas** - agendar, cancelar o modificar\n• **Especialidades** - médicos disponibles\n• **Telemedicina** - consultas virtuales\n• **Tu cuenta** - registro o acceso\n\n¿Cómo puedo ayudarte?",
    actions: medicalFAQ.default.actions
  };
}

export default function ChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        const greeting = medicalFAQ.default;
        setMessages([{
          id: '1',
          text: greeting.response,
          isBot: true,
          timestamp: new Date(),
          actions: greeting.actions
        }]);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = findResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isBot: true,
        timestamp: new Date(),
        actions: response.actions
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'login':
        window.location.href = '/login';
        break;
      case 'register':
        window.location.href = '/registro';
        break;
      case 'contact':
        window.location.href = '/contacto';
        break;
      case 'appointment':
      case 'telemedicine':
        sendMessage('¿Cómo puedo agendar una cita?');
        break;
      case 'specialists':
      case 'all_specialists':
      case 'general':
        sendMessage('¿Qué especialidades tienen disponibles?');
        break;
      case 'about':
        sendMessage('Cuéntame más sobre Kenkō');
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
          size="icon"
          aria-label={isOpen ? "Cerrar asistente virtual" : "Abrir asistente virtual"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        
        {/* Notification dot */}
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-44 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]"
          >
            <Card className="shadow-2xl border-2 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Asistente Kenkō</h3>
                    <p className="text-xs text-white/80">Siempre disponible para ayudarte</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-80 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[85%]`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.isBot
                              ? 'bg-muted text-foreground rounded-tl-none'
                              : 'bg-primary text-primary-foreground rounded-tr-none'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                        </div>
                        
                        {/* Quick Actions */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="text-xs gap-1 h-7"
                                onClick={() => handleAction(action.action)}
                              >
                                {action.icon && <action.icon className="w-3 h-3" />}
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-xs">Escribiendo...</span>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1"
                    aria-label="Mensaje para el asistente"
                  />
                  <Button 
                    onClick={handleSend} 
                    size="icon"
                    disabled={!inputValue.trim()}
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Asistente virtual con IA • Respuestas automáticas
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
