import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Type, Contrast, X, Play, Pause, Square, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [hoverToRead, setHoverToRead] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState([1]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('a11y-font-size');
    const savedContrast = localStorage.getItem('a11y-high-contrast');
    const savedHoverToRead = localStorage.getItem('a11y-hover-to-read');
    const savedSpeechRate = localStorage.getItem('a11y-speech-rate');
    
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
    
    if (savedContrast === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
    
    if (savedHoverToRead === 'true') {
      setHoverToRead(true);
    }

    if (savedSpeechRate) {
      setSpeechRate([parseFloat(savedSpeechRate)]);
    }
  }, []);

  // Hover to read functionality
  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!hoverToRead) return;
    
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    
    if (text && text.length > 0 && text.length < 500) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Add visual indicator
      target.style.outline = '2px solid hsl(238 41% 41%)';
      target.style.outlineOffset = '2px';
      
      // Delay before reading to prevent rapid fire
      hoverTimeoutRef.current = setTimeout(() => {
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'es-ES';
          utterance.rate = speechRate[0];
          speechSynthesis.speak(utterance);
        }
      }, 300);
    }
  }, [hoverToRead, speechRate]);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    target.style.outline = '';
    target.style.outlineOffset = '';
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (hoverToRead && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, [hoverToRead]);

  useEffect(() => {
    if (hoverToRead) {
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
    } else {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    }
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [hoverToRead, handleMouseOver, handleMouseOut]);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(80, Math.min(150, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('a11y-font-size', newSize.toString());
    
    toast({
      title: 'Tamaño de fuente ajustado',
      description: `${newSize}% del tamaño normal`,
    });
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    localStorage.setItem('a11y-high-contrast', newValue.toString());
    
    toast({
      title: newValue ? 'Alto contraste activado' : 'Alto contraste desactivado',
    });
  };

  const toggleHoverToRead = () => {
    const newValue = !hoverToRead;
    setHoverToRead(newValue);
    localStorage.setItem('a11y-hover-to-read', newValue.toString());
    
    if (!newValue && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    toast({
      title: newValue ? 'Lectura al pasar el mouse activada' : 'Lectura al pasar el mouse desactivada',
      description: newValue ? 'Pasa el mouse sobre cualquier texto para escucharlo' : '',
    });
  };

  const startReading = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: 'No disponible',
        description: 'Tu navegador no soporta text-to-speech',
        variant: 'destructive',
      });
      return;
    }

    const mainContent = document.querySelector('main')?.textContent || '';
    
    if (!mainContent.trim()) {
      toast({
        title: 'Sin contenido',
        description: 'No hay contenido para leer en esta página',
        variant: 'destructive',
      });
      return;
    }

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(mainContent);
    utterance.lang = 'es-ES';
    utterance.rate = speechRate[0];
    utteranceRef.current = utterance;
    
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
    
    toast({
      title: 'Lectura iniciada',
      description: 'Leyendo el contenido de la página',
    });
  };

  const pauseReading = () => {
    if ('speechSynthesis' in window) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        toast({ title: 'Lectura reanudada' });
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
        toast({ title: 'Lectura pausada' });
      }
    }
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
      toast({ title: 'Lectura detenida' });
    }
  };

  const handleSpeechRateChange = (value: number[]) => {
    setSpeechRate(value);
    localStorage.setItem('a11y-speech-rate', value[0].toString());
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg bg-card border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        aria-label="Abrir herramientas de accesibilidad"
      >
        <Type className="w-5 h-5" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 p-5 w-80 shadow-2xl border-2 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Type className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Accesibilidad</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar"
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-5">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                <span>Tamaño de fuente</span>
                <span className="text-muted-foreground">{fontSize}%</span>
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => adjustFontSize(-10)}
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold"
                  aria-label="Reducir tamaño de fuente"
                >
                  A-
                </Button>
                <Button
                  onClick={() => setFontSize(100)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  aria-label="Restablecer tamaño"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => adjustFontSize(10)}
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold"
                  aria-label="Aumentar tamaño de fuente"
                >
                  A+
                </Button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <Contrast className="w-4 h-4 text-primary" />
                Alto Contraste
              </Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>

            {/* Hover to Read */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hover-read" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Leer al pasar mouse
              </Label>
              <Switch
                id="hover-read"
                checked={hoverToRead}
                onCheckedChange={toggleHoverToRead}
              />
            </div>

            {/* Speech Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                <span>Velocidad de lectura</span>
                <span className="text-muted-foreground">{speechRate[0]}x</span>
              </label>
              <Slider
                value={speechRate}
                onValueChange={handleSpeechRateChange}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Read Page Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Leer página completa
              </label>
              <div className="flex gap-2">
                {!isReading ? (
                  <Button
                    onClick={startReading}
                    variant="default"
                    size="sm"
                    className="flex-1 gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Iniciar
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={pauseReading}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      {isPaused ? 'Reanudar' : 'Pausar'}
                    </Button>
                    <Button
                      onClick={stopReading}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Detener
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Status indicator */}
            {isReading && (
              <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                <Volume2 className="w-4 h-4" />
                <span>{isPaused ? 'Lectura en pausa...' : 'Leyendo página...'}</span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Herramientas de accesibilidad WCAG 2.1
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
