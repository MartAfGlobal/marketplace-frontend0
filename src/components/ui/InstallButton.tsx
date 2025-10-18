"use client";
import { useEffect, useState } from "react";
import { Button } from "./Button/Button";
import { div } from "framer-motion/client";

export default function InstallButton() {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const handler = (e: any) => {
      e.preventDefault();
      if (mounted) setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // DEV MODE MOCK
    if (process.env.NODE_ENV === "development" && mounted && !prompt) {
      setPrompt({
        prompt: () => alert("Mock install prompt fired!"),
        userChoice: Promise.resolve({ outcome: "accepted" }),
      });
    }

    return () => {
      mounted = false;
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []); // ✅ run only once

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    console.log("User choice:", outcome);
    setPrompt(null);
  };

  if (!prompt) return null;

  return (
    <div className=" w-full">
      <Button
        onClick={handleInstall}
        className="fixed top-20 right-5 z-50 w-fit left-0 px-2 py-2"
      >
        Install App
      </Button>
    </div>
  );
}
