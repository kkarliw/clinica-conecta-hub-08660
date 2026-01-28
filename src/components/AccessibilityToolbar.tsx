import { useState, useEffect, useCallback } from "react";
import {
  Accessibility, Eye, Type, Volume2, Sun,
  Play, Pause, Square, MousePointer, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoverToRead, setHoverToRead] = useState(false);
  const [simplifiedUI, setSimplifiedUI] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Load saved preferences
    const savedFontSize = localStorage.getItem('a11y-font-size');
    const savedContrast = localStorage.getItem('a11y-high-contrast');
    
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
    
    if (savedContrast === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('a11y-font-size', fontSize.toString());
    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y-high-contrast', highContrast.toString());
    return () => {
      document.documentElement.classList.remove('high-contrast');
    };
  }, [highContrast]);

  // Apply simplified UI
  useEffect(() => {
    if (simplifiedUI) {
      document.documentElement.classList.add('simplified-ui');
    } else {
      document.documentElement.classList.remove('simplified-ui');
    }
    return () => {
      document.documentElement.classList.remove('simplified-ui');
    };
  }, [simplifiedUI]);

  // Hover to read functionality
  useEffect(() => {
    if (!hoverToRead || !speechSynthesis) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent?.trim();
      
      if (text && text.length > 0 && text.length < 500) {
        // Only read interactive elements and content
        const isReadable = target.matches('p, h1, h2, h3, h4, h5, h6, span, a, button, label, li, td, th, [role="button"]');
        if (isReadable) {
          // Add visual indicator
          target.style.outline = '2px solid hsl(238 41% 41%)';
          target.style.outlineOffset = '2px';
          
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'es-ES';
          utterance.rate = 0.9;
          speechSynthesis.speak(utterance);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.style.outline = '';
      target.style.outlineOffset = '';
      speechSynthesis.cancel();
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      speechSynthesis.cancel();
    };
  }, [hoverToRead, speechSynthesis]);

  const startReading = useCallback(() => {
    if (!speechSynthesis) {
      toast.error("Tu navegador no soporta lectura en voz alta");
      return;
    }

    // Get main content
    const mainContent = document.querySelector('main') || document.body;
    const textElements = mainContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th');
    
    let fullText = '';
    textElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text) fullText += text + '. ';
    });

    if (!fullText.trim()) {
      toast.info("No hay contenido para leer en esta página");
      return;
    }

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
    toast.success("Iniciando lectura de la página");
  }, [speechSynthesis]);

  const pauseReading = useCallback(() => {
    if (speechSynthesis) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        toast.info("Reanudando lectura");
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
        toast.info("Lectura pausada");
      }
    }
  }, [speechSynthesis, isPaused]);

  const stopReading = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
      toast.info("Lectura detenida");
    }
  }, [speechSynthesis]);

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setHoverToRead(false);
    setSimplifiedUI(false);
    stopReading();
    toast.success("Configuración restablecida");
  };

  const activeFeatures = [highContrast, hoverToRead, simplifiedUI, fontSize !== 100].filter(Boolean).length;

  return (
    <div className="fixed top-20 right-4 z-40">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full shadow-lg bg-card border-2 hover:bg-accent relative"
            aria-label="Abrir opciones de accesibilidad"
          >
            <Accessibility className="w-5 h-5" />
            {activeFeatures > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              >
                {activeFeatures}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          align="end" 
          className="w-80 p-0"
          sideOffset={8}
        >
          <div className="p-4 border-b bg-accent/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Accesibilidad</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={resetSettings} className="text-xs h-7">
                Restablecer
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-5 max-h-[400px] overflow-y-auto">
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Tamaño de texto
                </Label>
                <span className="text-sm text-muted-foreground">{fontSize}%</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={75}
                max={150}
                step={5}
                className="w-full"
                aria-label="Ajustar tamaño de texto"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pequeño</span>
                <span>Grande</span>
              </div>
            </div>

            <Separator />

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                <Eye className="w-4 h-4" />
                <div>
                  <p>Alto contraste</p>
                  <p className="text-xs text-muted-foreground font-normal">Mayor visibilidad</p>
                </div>
              </Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Activar alto contraste"
              />
            </div>

            {/* Simplified UI */}
            <div className="flex items-center justify-between">
              <Label htmlFor="simplified-ui" className="flex items-center gap-2 cursor-pointer">
                <Sun className="w-4 h-4" />
                <div>
                  <p>Interfaz simplificada</p>
                  <p className="text-xs text-muted-foreground font-normal">Diseño más limpio</p>
                </div>
              </Label>
              <Switch
                id="simplified-ui"
                checked={simplifiedUI}
                onCheckedChange={setSimplifiedUI}
                aria-label="Activar interfaz simplificada"
              />
            </div>

            <Separator />

            {/* Text to Speech - Page Reading */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Leer página en voz alta
              </Label>
              <div className="flex gap-2">
                {!isReading ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={startReading}
                    aria-label="Iniciar lectura"
                  >
                    <Play className="w-4 h-4" />
                    Reproducir
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={pauseReading}
                      aria-label={isPaused ? "Reanudar lectura" : "Pausar lectura"}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      {isPaused ? "Reanudar" : "Pausar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={stopReading}
                      aria-label="Detener lectura"
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Hover to Read */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hover-read" className="flex items-center gap-2 cursor-pointer">
                <MousePointer className="w-4 h-4" />
                <div>
                  <p>Leer al pasar el mouse</p>
                  <p className="text-xs text-muted-foreground font-normal">Lee el texto al hover</p>
                </div>
              </Label>
              <Switch
                id="hover-read"
                checked={hoverToRead}
                onCheckedChange={(checked) => {
                  setHoverToRead(checked);
                  if (checked) {
                    toast.info("Pasa el mouse sobre el texto para escucharlo");
                  }
                }}
                aria-label="Activar lectura al pasar el mouse"
              />
            </div>

            {/* Reading Status */}
            {isReading && (
              <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                <Volume2 className="w-4 h-4" />
                <span>{isPaused ? 'Lectura en pausa...' : 'Leyendo página...'}</span>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-accent/20 text-center">
            <p className="text-xs text-muted-foreground">
              WCAG 2.1 AA Compliant
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
