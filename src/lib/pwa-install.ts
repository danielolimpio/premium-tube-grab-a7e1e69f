// PWA Install — apenas APIs nativas do navegador.
// - Android/Desktop Chrome/Edge: captura beforeinstallprompt e dispara prompt() no 1º gesto.
// - iOS Safari: exibe toast nativo (sonner) com instrução para Compartilhar → Adicionar à Tela de Início.
// Sem modais customizados. Respeita exigência de gesto do usuário.

import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const IOS_HINT_KEY = "pwa-ios-hint-shown";
const INSTALLED_KEY = "pwa-installed";

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  // iPadOS 13+ reports as Mac; detect via touch
  const isIPadOS = ua.includes("Mac") && "ontouchend" in document;
  return isIOSDevice || isIPadOS;
}

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function initPwaInstall() {
  if (typeof window === "undefined") return;
  if (isInIframe()) return; // não atrapalhar preview do editor
  if (isStandalone()) return;
  if (localStorage.getItem(INSTALLED_KEY) === "1") return;

  let deferredPrompt: BeforeInstallPromptEvent | null = null;
  let firstGestureBound = false;

  const triggerNativePrompt = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "1");
      }
    } catch {
      // ignore — usuário pode descartar
    } finally {
      deferredPrompt = null;
    }
  };

  const onFirstGesture = () => {
    if (deferredPrompt) {
      void triggerNativePrompt();
    }
    cleanupGesture();
  };

  const cleanupGesture = () => {
    window.removeEventListener("click", onFirstGesture, true);
    window.removeEventListener("touchend", onFirstGesture, true);
    firstGestureBound = false;
  };

  const bindFirstGesture = () => {
    if (firstGestureBound) return;
    firstGestureBound = true;
    window.addEventListener("click", onFirstGesture, { capture: true, once: false });
    window.addEventListener("touchend", onFirstGesture, { capture: true, once: false });
  };

  // Android / Desktop (Chrome, Edge, Brave, Opera)
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    bindFirstGesture();
  });

  window.addEventListener("appinstalled", () => {
    localStorage.setItem(INSTALLED_KEY, "1");
    deferredPrompt = null;
    cleanupGesture();
  });

  // iOS Safari — sem API de prompt; mostrar dica nativa via toast (1x)
  if (isIOS() && !localStorage.getItem(IOS_HINT_KEY)) {
    const showIOSHint = () => {
      toast("Instale o app na tela inicial", {
        description: "Toque em Compartilhar e depois em \"Adicionar à Tela de Início\".",
        duration: 8000,
      });
      localStorage.setItem(IOS_HINT_KEY, "1");
      window.removeEventListener("click", showIOSHint, true);
      window.removeEventListener("touchend", showIOSHint, true);
    };
    window.addEventListener("click", showIOSHint, { capture: true, once: true });
    window.addEventListener("touchend", showIOSHint, { capture: true, once: true });
  }
}
