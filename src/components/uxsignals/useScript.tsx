import { useEffect } from 'react';

// Hook for å skru på UX Signals script for brukertesting
// https://app.uxsignals.com/docs/js
const useScript = (ready: boolean) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://widget.uxsignals.com/embed.js';
        if (ready) {
            document.body.appendChild(script);
        }

        return () => {
            try {
                document.body.removeChild(script);
            } catch {}
        };
    }, [ready]);
};

export default useScript;
