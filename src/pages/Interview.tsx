import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { conversationAtom } from "@/store/conversation";
import { settingsSavedAtom } from "@/store/settings";

export const Header = memo(() => {
  const [, setScreenState] = useAtom(screenAtom);
  const [conversation] = useAtom(conversationAtom);
  const [settingsSaved] = useAtom(settingsSavedAtom);

  const handleSettings = () => {
    if (!conversation) {
      setScreenState({ currentScreen: "settings" });
    }
  };

  return (
    <header className="flex w-full items-start justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
      <img
        src="/images/logo.svg"
        alt="Tavus"
        className="relative h-6 sm:h-10"
      />
      <div className="relative">
        {settingsSaved && (
          <div className="absolute -top-2 -right-2 z-20 rounded-full bg-green-500 p-1 animate-fade-in">
            <Check className="size-3" />
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleSettings}
          className="relative size-10 sm:size-14 border-0 bg-transparent hover:bg-zinc-800"
        >
        </Button>
      </div>
    </header>
  );
});

import { GitFork, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-between gap-4">
      <a
        href="https://github.com/Tavus-Engineering/tavus-vibecode-quickstart"
        target="_blank"
        className="hover:shadow-footer-btn relative flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.1)] px-2 py-3 text-sm text-white transition-all duration-200 hover:text-primary sm:p-4 h-[44px]"
      >
        <GitFork className="size-4" /> Fork the demo
      </a>

      <a
        href="https://docs.tavus.io/sections/conversational-video-interface/cvi-overview"
        target="_blank"
        className="relative flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.1)] px-2 py-3 text-sm text-white backdrop-blur-sm hover:bg-[rgba(255,255,255,0.15)] transition-colors duration-200 sm:p-4 h-[44px]"
      >
        How it works <ExternalLink className="size-4" />
      </a>
    </footer>
  );
};

import {
  IntroLoading,
  Outage,
  OutOfMinutes,
  Intro,
  Instructions,
  Conversation,
  FinalScreen,
  Settings,
} from "@/screens";

function InterviewApp() {
  const [{ currentScreen }] = useAtom(screenAtom);

  const renderScreen = () => {
    switch (currentScreen) {
      case "introLoading":
        return <IntroLoading />;
      case "outage":
        return <Outage />;
      case "outOfMinutes":
        return <OutOfMinutes />;
      case "intro":
        return <Intro />;
      case "settings":
        return <Settings />;
      case "instructions":
        return <Instructions />;
      case "conversation":
        return <Conversation />;
      case "finalScreen":
        return <FinalScreen />;
      default:
        return <IntroLoading />;
    }
  };

  return (
    <main className="flex h-svh flex-col items-center justify-between gap-3 p-5 sm:gap-4 lg:p-8 bg-black">
      {currentScreen !== "introLoading" && <Header />}
      {renderScreen()}
      {currentScreen !== "introLoading" && <Footer />}
    </main>
  );
}

export default InterviewApp;
