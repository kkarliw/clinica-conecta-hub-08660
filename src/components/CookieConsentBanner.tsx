import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing the banner for a better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    localStorage.setItem('cookie-preferences', JSON.stringify(allPreferences));
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    localStorage.setItem('cookie-preferences', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="bg-card border-2 rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Icon and Text */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">🍪 Usamos cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    Utilizamos cookies para mejorar tu experiencia y analizar el uso del sitio. 
                    Puedes personalizar tus preferencias o aceptar todas las cookies.{' '}
                    <Link to="/cookies" className="text-primary hover:underline font-medium">
                      Más información
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link to="/cookies">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Settings className="w-4 h-4" />
                    Personalizar
                  </Button>
                </Link>
                <Button variant="secondary" onClick={acceptNecessary} className="w-full sm:w-auto">
                  Solo esenciales
                </Button>
                <Button onClick={acceptAll} className="gap-2 w-full sm:w-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  Aceptar todas
                </Button>
              </div>

              {/* Close button (mobile) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={acceptNecessary}
                className="absolute top-4 right-4 md:hidden"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
