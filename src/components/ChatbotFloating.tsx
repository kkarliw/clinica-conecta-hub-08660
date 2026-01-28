import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Bot, User, Calendar, Search, Stethoscope, HelpCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: React.ReactNode;
}

// Contextual FAQ responses based on current page
const getContextualResponses = (pathname: string) => {
  const isSearchPage = pathname.includes('/buscar');
  const isConsultorioPage = pathname.includes('/consultorio/') && !pathname.includes('/dashboard');
  const isAgendarPage = pathname.includes('/agendar');
  const isPacientesLanding = pathname === '/pacientes';
  const isConsultoriosLanding = pathname === '/para-consultorios';

  const baseResponses: Record<string, { response: string; actions?: QuickAction[] }> = {
    // Search related
    buscar: {
      response: "¡Puedo ayudarte a encontrar el consultorio ideal! 🔍\n\n• ¿Qué especialidad necesitas?\n• ¿En qué ciudad te encuentras?\n• ¿Tienes algún rango de precio preferido?",
      actions: [
        { label: "Buscar por especialidad", action: "search_specialty", icon: <Stethoscope className="w-3 h-3" /> },
        { label: "Buscar cerca de mí", action: "search_nearby", icon: <MapPin className="w-3 h-3" /> }
      ]
    },
    especialidad: {
      response: "Tenemos consultorios en múltiples especialidades:\n\n🦷 Odontología\n❤️ Cardiología\n👶 Pediatría\n🧠 Neurología\n👁️ Oftalmología\n🏥 Medicina General\n\n¿Cuál te interesa?"
    },
    // Appointment related
    cita: {
      response: "Para agendar una cita:\n\n1️⃣ Busca un consultorio por especialidad\n2️⃣ Revisa los servicios y precios\n3️⃣ Selecciona fecha y hora disponible\n4️⃣ Ingresa tus datos\n5️⃣ ¡Listo! Recibirás confirmación por email",
      actions: [
        { label: "Buscar consultorios", action: "go_search", icon: <Search className="w-3 h-3" /> },
        { label: "Mis citas", action: "go_appointments", icon: <Calendar className="w-3 h-3" /> }
      ]
    },
    agendar: {
      response: "El proceso de agendamiento es muy sencillo:\n\n✅ Sin necesidad de registro previo\n✅ Confirmación instantánea\n✅ Recordatorios por email\n✅ Pago en el consultorio\n\n¿Te ayudo a buscar disponibilidad?"
    },
    // Pricing related  
    precio: {
      response: "Los precios varían según el consultorio y servicio. Consulta general desde $40.000 COP. Cada consultorio publica sus tarifas de forma transparente en su perfil. 💰"
    },
    pago: {
      response: "El pago se realiza directamente en el consultorio. Algunos aceptan:\n\n💳 Tarjetas de crédito/débito\n💵 Efectivo\n🏥 Seguros médicos\n\nConsulta los métodos aceptados en cada perfil."
    },
    // Consultorio registration
    registrar: {
      response: "¿Eres profesional de la salud? 🏥\n\nRegistra tu consultorio en Kenkō:\n• Recibe citas 24/7\n• Gestiona tu agenda online\n• Aumenta tu visibilidad\n• Plan básico gratis",
      actions: [
        { label: "Registrar consultorio", action: "go_register_consultorio" }
      ]
    },
    consultorio: {
      response: "Los consultorios en Kenkō ofrecen:\n\n✅ Perfiles verificados\n✅ Precios transparentes\n✅ Reseñas de pacientes\n✅ Disponibilidad en tiempo real\n\n¿Quieres buscar uno específico?"
    },
    // Account related
    cuenta: {
      response: "Con una cuenta en Kenkō puedes:\n\n👤 Guardar tu historial de citas\n🔔 Recibir recordatorios\n⭐ Dejar reseñas\n📋 Acceder a tu historial médico\n\n¿Quieres crear una cuenta?",
      actions: [
        { label: "Crear cuenta", action: "go_register" },
        { label: "Iniciar sesión", action: "go_login" }
      ]
    },
    // General
    hola: {
      response: "¡Hola! 👋 Soy el asistente virtual de Kenkō.\n\nPuedo ayudarte a:\n• Buscar consultorios y médicos\n• Agendar citas\n• Resolver dudas sobre servicios\n\n¿En qué puedo ayudarte hoy?"
    },
    ayuda: {
      response: "Estoy aquí para ayudarte. Puedes preguntarme sobre:\n\n🔍 Búsqueda de consultorios\n📅 Agendamiento de citas\n💰 Precios y pagos\n👤 Tu cuenta\n🏥 Registro de consultorios\n\n¿Qué necesitas?"
    },
    gracias: {
      response: "¡Con gusto! 😊 Si tienes más preguntas, aquí estaré. ¡Que tengas excelente día!"
    }
  };

  // Add context-specific responses
  if (isSearchPage) {
    baseResponses.default = {
      response: "Veo que estás buscando consultorios. 🔍\n\nPuedes filtrar por:\n• Especialidad\n• Ciudad\n• Precio\n• Valoración\n\n¿Necesitas ayuda con la búsqueda?",
      actions: [
        { label: "Ver especialidades", action: "show_specialties" }
      ]
    };
  } else if (isConsultorioPage) {
    baseResponses.default = {
      response: "Estás viendo el perfil de un consultorio. 🏥\n\nDesde aquí puedes:\n• Ver servicios y precios\n• Conocer a los profesionales\n• Revisar horarios\n• Leer reseñas\n• Agendar una cita\n\n¿Te ayudo con algo?"
    };
  } else if (isAgendarPage) {
    baseResponses.default = {
      response: "Estás en el proceso de agendamiento. 📅\n\nSi tienes dudas sobre:\n• Disponibilidad de horarios\n• Precios del servicio\n• Datos requeridos\n\n¡Pregúntame!"
    };
  } else if (isPacientesLanding) {
    baseResponses.default = {
      response: "¡Bienvenido a Kenkō! 🩺\n\nSoy tu asistente para encontrar atención médica de calidad. Puedo ayudarte a:\n\n• Buscar consultorios cerca de ti\n• Comparar precios y servicios\n• Agendar citas fácilmente\n\n¿Por dónde empezamos?",
      actions: [
        { label: "Buscar consultorios", action: "go_search", icon: <Search className="w-3 h-3" /> }
      ]
    };
  } else if (isConsultoriosLanding) {
    baseResponses.default = {
      response: "¿Interesado en registrar tu consultorio? 🏥\n\nKenkō te ofrece:\n• Mayor visibilidad online\n• Agenda automatizada\n• Más pacientes\n• Herramientas de gestión\n\n¿Te cuento más?",
      actions: [
        { label: "Ver beneficios", action: "show_benefits" },
        { label: "Registrar consultorio", action: "go_register_consultorio" }
      ]
    };
  } else {
    baseResponses.default = {
      response: "¡Hola! Soy el asistente de Kenkō. 👋\n\nPuedo ayudarte con:\n• Buscar consultorios\n• Agendar citas\n• Resolver dudas\n\n¿Qué necesitas?"
    };
  }

  return baseResponses;
};

const findResponse = (message: string, pathname: string): { response: string; actions?: QuickAction[] } => {
  const responses = getContextualResponses(pathname);
  const lowerMessage = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const keywords: Record<string, string[]> = {
    hola: ["hola", "buenos dias", "buenas tardes", "buenas noches", "hey", "hi"],
    buscar: ["buscar", "encontrar", "busco", "necesito", "donde hay", "cercano"],
    especialidad: ["especialidad", "especialidades", "medico", "doctor", "doctora", "tipo"],
    cita: ["cita", "citas", "agendar", "reservar", "turno", "turnos"],
    agendar: ["agendar", "reservar", "programar", "sacar cita"],
    precio: ["precio", "precios", "costo", "costos", "cuanto", "tarifa", "tarifas", "valor"],
    pago: ["pago", "pagar", "pagos", "metodo", "tarjeta", "efectivo"],
    registrar: ["registrar", "registro", "unirme", "inscribir", "soy medico", "soy doctor"],
    consultorio: ["consultorio", "consultorios", "clinica", "clinicas", "centro"],
    cuenta: ["cuenta", "usuario", "perfil", "registro", "registrarme", "login"],
    ayuda: ["ayuda", "ayudar", "help", "no entiendo", "como funciona"],
    gracias: ["gracias", "thank", "thanks", "genial", "perfecto", "excelente"]
  };

  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      return responses[key] || responses.default;
    }
  }

  return responses.default;
};

export default function ChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when page changes and add contextual welcome
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const { response, actions } = getContextualResponses(location.pathname).default;
      setMessages([{
        id: 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
        actions
      }]);
    }
  }, [isOpen, location.pathname]);

  const handleAction = (action: string) => {
    switch (action) {
      case "go_search":
        navigate("/buscar");
        setIsOpen(false);
        break;
      case "go_register":
        navigate("/registro");
        setIsOpen(false);
        break;
      case "go_login":
        navigate("/login");
        setIsOpen(false);
        break;
      case "go_register_consultorio":
        navigate("/registro/consultorio");
        setIsOpen(false);
        break;
      case "go_appointments":
        navigate("/paciente/citas");
        setIsOpen(false);
        break;
      case "search_specialty":
        navigate("/buscar");
        setIsOpen(false);
        break;
      case "search_nearby":
        navigate("/buscar?ciudad=Bogotá");
        setIsOpen(false);
        break;
      case "show_specialties":
        handleSend("especialidades");
        break;
      case "show_benefits":
        handleSend("beneficios de registrar mi consultorio");
        break;
      default:
        break;
    }
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { response, actions } = findResponse(messageText, location.pathname);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date(),
        actions
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions: QuickAction[] = [
    { label: "Buscar consultorios", action: "go_search", icon: <Search className="w-3 h-3" /> },
    { label: "Agendar cita", action: "go_search", icon: <Calendar className="w-3 h-3" /> },
    { label: "Ayuda", action: "show_help", icon: <HelpCircle className="w-3 h-3" /> }
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat de ayuda"}
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
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-2xl border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Asistente Kenkō</h3>
                  <p className="text-xs text-primary-foreground/70">
                    {isTyping ? "Escribiendo..." : "En línea"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-accent/20">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.isBot ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-primary" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${message.isBot ? "" : "text-right"}`}>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.isBot 
                        ? "bg-card border rounded-tl-sm" 
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleAction(action.action)}
                          >
                            {action.icon}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Bar */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t bg-accent/30">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickActions.map((action, i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs gap-1 shrink-0"
                      onClick={() => handleAction(action.action)}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                  aria-label="Escribe tu mensaje"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
