import { Moon, Sun, Wallet } from "lucide-react";

export default function Navbar() {
  const toggle = () => document.documentElement.classList.toggle("dark");
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Crypto Wallet</span>
        </div>
        <button onClick={toggle} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Sun className="hidden dark:block w-5 h-5" />
          <Moon className="block dark:hidden w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
