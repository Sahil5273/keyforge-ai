import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black/40 backdrop-blur-md mt-auto">
      <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm font-mono">
        <div className="text-gray-500 mb-4 md:mb-0">
          <span className="text-neon-green">&gt;_</span> KEYFORGE_AI © {new Date().getFullYear()}
        </div>
        
        <div className="flex space-x-6">
          <a 
            href="https://github.com/Sahil5273/keyforge-ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
          >
            GitHub Repository
          </a>
          <Link to="/about" className="text-gray-500 hover:text-neon-green transition-colors">
            About the Project & AI
          </Link>
        </div>
      </div>
    </footer>
  );
}