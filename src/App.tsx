import { Home, Info, Plus } from "lucide-react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import AbbreviationDetail from "./pages/AbbreviationDetail";
import About from "./pages/About";
import CreateEntry from "./pages/CreateEntry";
import Index from "./pages/Index";
import { PolkadotProvider } from "./providers/PolkadotProvider";

function Navigation() {
  const links = [
    { to: "/", label: "Index", icon: Home },
    { to: "/create", label: "Create Entry", icon: Plus },
    { to: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-polkadot"></div>
            <span className="text-xl font-bold text-white">Polkadot.FYI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-polkadot"></div>
            <span className="text-white/70 text-sm">
              Built with Polkadot UI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://polkadot-ui.com"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Documentation
            </a>
            <a
              href="https://github.com/ggwpez/polkadot-fyi"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://polkadot.network"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Polkadot
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <PolkadotProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black">
          <Navigation />
          <main className="pt-16 pb-32">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateEntry />} />
              <Route path="/about" element={<About />} />
              <Route path="/:abbreviation" element={<AbbreviationDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </PolkadotProvider>
  );
}
