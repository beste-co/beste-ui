"use client";

import { CodeBlock } from "./code-block";
import { LoginForm } from "./login-form";
import { ProUnlockContent } from "./pro-unlock-modal";
import { REQUIRE_LOGIN_FOR_FREE_BLOCKS } from "@/lib/site-config";

interface ProCodeBlockProps {
  code: string;
  language?: string;
  isPro: boolean;
  isUserPro: boolean;
  isLoggedIn: boolean;
  onGetProAccess?: () => void;
  onLoginSuccess?: () => void;
}

// Dummy code shown to non-pro users who try to inspect the source
const DUMMY_PRO_CODE = `"use client";

// Nice try! You found the secret code area.
// But this isn't the real source code...
//
// We spent countless hours crafting this component,
// and we'd love for you to support our work!
//
// Here's a deal: Send us an email at hello@beste.co
// with the subject "I found the easter egg!"
// and we'll send you a special discount code.
//
// - The Beste Team

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SecretComponentProps {
  message?: string;
  onDiscover?: () => void;
}

export function SecretComponent({
  message = "You're persistent, we like that!",
  onDiscover
}: SecretComponentProps) {
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    // This would be really cool code if it were real...
    console.log("Looking for the source code?");
    console.log("Email us at hello@beste.co for a discount!");
  }, []);

  const handleClick = useCallback(() => {
    setDiscovered(true);
    onDiscover?.();

    // Imagine amazing animations here
    // Bento grids floating gracefully
    // Cards sliding into perfect position
    // All the good stuff you're looking for
  }, [onDiscover]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8"
    >
      {/*
        The real component has beautiful styling here.
        Responsive layouts, smooth animations,
        carefully crafted spacing...

        But you'll need Pro access to see it!

        Seriously though, we appreciate your curiosity.
        Developers who dig into code are our people.

        hello@beste.co - Let's talk!
      */}
      <h1 className="text-4xl font-bold">
        {discovered ? "You found nothing!" : message}
      </h1>
      <p className="mt-4 text-muted-foreground">
        Pro tip: The actual component is much cooler than this.
      </p>
      <button
        onClick={handleClick}
        className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg"
      >
        {discovered ? "Still nothing here..." : "Click for secrets"}
      </button>
    </motion.div>
  );
}

// P.S. We see you scrolling down looking for more code.
// There's nothing here but our appreciation for your effort!
//
// Fun fact: This dummy code took longer to write
// than you might think. We wanted to make you smile.
//
// If you've read this far, you definitely deserve
// that discount. Email us!
//
// hello@beste.co
// Subject: "I read the whole dummy code"
//
// See you on the Pro side!

export default SecretComponent;
`;

export function ProCodeBlock({
  code,
  language = "tsx",
  isPro,
  isUserPro,
  isLoggedIn,
  onGetProAccess,
  onLoginSuccess,
}: ProCodeBlockProps) {
  // For free blocks: check if login is required based on config
  // For pro blocks: always require login
  const requiresLogin = isPro || REQUIRE_LOGIN_FOR_FREE_BLOCKS;

  // If user is not logged in and login is required, show login overlay
  if (!isLoggedIn && requiresLogin) {
    return (
      <div className="relative h-full">
        {/* Dummy code in background */}
        <div className="blur-[4px] select-none pointer-events-none">
          <CodeBlock code={DUMMY_PRO_CODE} language={language} />
        </div>

        {/* Overlay with LoginForm */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-xl bg-card border shadow-[0_8px_40px_-12px] shadow-foreground/15 w-full sm:max-w-sm mx-4 overflow-hidden">
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              message="Sign in to view the source code"
              isModal
            />
          </div>
        </div>
      </div>
    );
  }

  // If not a pro block, or user is pro, show normal code
  if (!isPro || isUserPro) {
    return <CodeBlock code={code} language={language} />;
  }

  // Pro block, logged in but non-pro user: show dummy code with pro unlock overlay
  return (
    <div className="relative h-full">
      {/* Dummy code in background - not the real source! */}
      <div className="blur-[6px] select-none pointer-events-none">
        <CodeBlock code={DUMMY_PRO_CODE} language={language} />
      </div>

      {/* Overlay with ProUnlockContent (no close button) */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="p-6 rounded-xl bg-card border shadow-[0_8px_40px_-12px] shadow-foreground/15 max-w-sm mx-4">
          <ProUnlockContent onGetProAccess={onGetProAccess} />
        </div>
      </div>
    </div>
  );
}
