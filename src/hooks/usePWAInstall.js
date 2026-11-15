import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage Progressive Web App (PWA) installation across
 * Android, iOS, and Desktop devices with comprehensive state management.
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installStatus, setInstallStatus] = useState('checking'); // 'can_prompt' | 'how_to_install' | 'installing' | 'installed' | 'unavailable'

  useEffect(() => {
    // 1. Detect if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(Boolean(isStandaloneMode));
      return Boolean(isStandaloneMode);
    };

    const standalone = checkStandalone();

    // 2. Platform detection (with full iPadOS 13+ support)
    const ua = window.navigator.userAgent || '';
    const isIPad = (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1) || /iPad/.test(ua);
    const iosDevice = (/iPhone|iPod/.test(ua) || isIPad) && !window.MSStream;
    const androidDevice = /android/i.test(ua);

    setIsIOS(iosDevice);
    setIsAndroid(androidDevice);

    if (standalone) {
      setInstallStatus('installed');
      return;
    }

    // Default status if not installed
    if (iosDevice) {
      setInstallStatus('how_to_install');
    } else {
      setInstallStatus('how_to_install'); // Will upgrade to 'can_prompt' when event fires
    }

    // 3. Listen for Chrome / Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallStatus('can_prompt');
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstallStatus('installed');
      setIsModalOpen(false);
    };

    // 5. Listen for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsStandalone(true);
        setInstallStatus('installed');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    } else {
      mediaQuery.addListener(handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      } else {
        mediaQuery.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  // Trigger installation or open guidance modal
  const promptInstall = useCallback(async (onSuccess, onError) => {
    if (isStandalone) {
      if (onSuccess) onSuccess('PlateSync is already installed on your device!');
      return;
    }

    // If native prompt is available (Android Chrome, Edge, desktop Chrome)
    if (deferredPrompt) {
      setInstallStatus('installing');
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          setInstallStatus('installed');
          setIsStandalone(true);
          setDeferredPrompt(null);
          if (onSuccess) onSuccess('PlateSync successfully installed!');
        } else {
          setInstallStatus('can_prompt');
          if (onError) onError('Installation dismissed.');
        }
      } catch (err) {
        setInstallStatus('how_to_install');
        setIsModalOpen(true);
      }
      return;
    }

    // Otherwise show step-by-step instructions modal (iOS, or Android without prompt)
    setIsModalOpen(true);
  }, [deferredPrompt, isStandalone]);

  // Derived button text according to specification
  const getButtonLabel = () => {
    if (isStandalone || installStatus === 'installed') {
      return 'Installed';
    }
    if (installStatus === 'installing') {
      return 'Installing...';
    }
    if (deferredPrompt) {
      return 'Install App';
    }
    if (isIOS) {
      return 'How to Install';
    }
    return 'Install App';
  };

  return {
    isStandalone,
    isIOS,
    isAndroid,
    installStatus,
    buttonLabel: getButtonLabel(),
    hasNativePrompt: Boolean(deferredPrompt),
    isModalOpen,
    setIsModalOpen,
    promptInstall
  };
};