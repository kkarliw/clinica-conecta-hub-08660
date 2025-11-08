import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Type, Contrast, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('a11y-font-size');
    const savedContrast = localStorage.getItem('a11y-high-contrast');
    
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
    
    if (savedContrast === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
  }, []);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(80, Math.min(140, fontSize + delta));
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

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const mainContent = document.querySelector('main')?.textContent || '';
      const utterance = new SpeechSynthesisUtterance(mainContent);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
      
      toast({
        title: 'Lectura iniciada',
        description: 'Leyendo el contenido de la página',
      });
    } else {
      toast({
        title: 'No disponible',
        description: 'Tu navegador no soporta text-to-speech',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full shadow-lg"
        aria-label="Abrir herramientas de accesibilidad"
      >
        <Type className="w-5 h-5" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 p-4 w-72 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Accesibilidad</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Tamaño de fuente: {fontSize}%
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => adjustFontSize(-10)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  A-
                </Button>
                <Button
                  onClick={() => adjustFontSize(10)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  A+
                </Button>
              </div>
            </div>

            <Button
              onClick={toggleHighContrast}
              variant={highContrast ? 'default' : 'outline'}
              className="w-full gap-2"
            >
              <Contrast className="w-4 h-4" />
              {highContrast ? 'Desactivar' : 'Activar'} Alto Contraste
            </Button>

            <Button
              onClick={speakText}
              variant="outline"
              className="w-full gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Leer Página
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
