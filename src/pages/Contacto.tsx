import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Mail, Phone, MapPin, Clock, Send, 
  MessageSquare, Building2, Headphones, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import kenkoLogo from "@/assets/kenko-logo.png";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    asunto: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Mensaje enviado correctamente. Te contactaremos pronto.");
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contacto@kenko.health",
      description: "Respuesta en 24 horas"
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 (1) 234 5678",
      description: "Lun - Vie, 8am - 6pm"
    },
    {
      icon: MapPin,
      title: "Oficina Principal",
      value: "Bogotá, Colombia",
      description: "Zona Norte, Edificio Empresarial"
    },
    {
      icon: Clock,
      title: "Horario de Atención",
      value: "Lunes a Viernes",
      description: "8:00 AM - 6:00 PM (COT)"
    }
  ];

  const departments = [
    { icon: Headphones, title: "Soporte Técnico", email: "soporte@kenko.health" },
    { icon: Building2, title: "Ventas Empresariales", email: "ventas@kenko.health" },
    { icon: MessageSquare, title: "Atención al Cliente", email: "atencion@kenko.health" }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <motion.div 
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">¡Mensaje Enviado!</h1>
          <p className="text-muted-foreground mb-8">
            Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá en las próximas 24 horas.
          </p>
          <Link to="/">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={kenkoLogo} alt="Kenkō" className="h-10 md:h-12 w-auto" />
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2 hover:bg-primary/5">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-accent/50 to-background py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(238_41%_41%_/_0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(238_41%_41%_/_0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Estamos aquí para ayudarte</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Contáctanos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes preguntas sobre Kenkō? Nuestro equipo está listo para ayudarte a transformar tu consultorio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Envíanos un mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="border-2 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="border-2 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="+57 300 123 4567"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="border-2 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Organización / Consultorio</Label>
                      <Input
                        id="empresa"
                        placeholder="Nombre de tu organización"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="border-2 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Select
                      value={formData.asunto}
                      onValueChange={(value) => setFormData({ ...formData, asunto: value })}
                      required
                    >
                      <SelectTrigger className="border-2 focus:border-primary">
                        <SelectValue placeholder="Selecciona un asunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo">Solicitar demostración</SelectItem>
                        <SelectItem value="precios">Información de precios</SelectItem>
                        <SelectItem value="soporte">Soporte técnico</SelectItem>
                        <SelectItem value="ventas">Ventas empresariales</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      rows={6}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      required
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-xl">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{info.title}</p>
                      <p className="text-sm text-foreground">{info.value}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-xl">Departamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <dept.icon className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{dept.title}</p>
                      <p className="text-xs text-muted-foreground">{dept.email}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Headphones className="w-12 h-12 text-primary mx-auto mb-3" />
                </motion.div>
                <h4 className="font-bold mb-2">¿Necesitas ayuda urgente?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Nuestro equipo de soporte está disponible para clientes premium.
                </p>
                <Button variant="outline" className="w-full border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                  Chat en vivo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <img src={kenkoLogo} alt="Kenkō" className="h-12 w-auto mb-4 brightness-0 invert" />
              <p className="text-primary-foreground/70 max-w-md">
                La plataforma líder en gestión de consultorios médicos. El camino a tu salud.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li><Link to="/terminos" className="hover:text-primary-foreground transition-colors">Términos de uso</Link></li>
                <li><Link to="/privacidad" className="hover:text-primary-foreground transition-colors">Privacidad</Link></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contacto@kenko.health</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +57 (1) 234 5678</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/50">
            <p>© {new Date().getFullYear()} Kenkō. El camino a tu salud. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
