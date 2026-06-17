import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, loginWithGoogle, logout } from "../firebase";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const linkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `hover:text-neon-green transition-colors ${
      isActive ? "text-neon-green border-b border-neon-green pb-1" : "text-gray-400"
    }`;
  };

  return (
    <nav className="border-b border-zinc-800 bg-black/40 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-2 font-bold text-xl tracking-wider">
        <span className="text-neon-green">&gt;_</span>
        <span className="text-white">KEYFORGE<span className="text-neon-green">_AI</span></span>
      </div>

      <div className="flex items-center space-x-8 text-sm font-medium">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/type" className={linkClass("/type")}>Type</Link>
        <Link to="/leaderboard" className={linkClass("/leaderboard")}>Leaderboard</Link>
        <Link to="/analytics" className={linkClass("/analytics")}>Analytics</Link>
        <Link to="/prediction" className={linkClass("/prediction")}>Prediction</Link>
        <Link to="/hindi-guide" className={linkClass("/hindi-guide")}>Hindi Guide</Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-neon-green"
                />
              )}
              <span className="text-sm text-gray-300 font-medium hidden md:inline hover:text-neon-green transition-colors">
                {user.displayName}
              </span>
            </Link>
            <button 
              onClick={logout}
              className="text-xs bg-zinc-900 border border-zinc-700 text-gray-300 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={loginWithGoogle}
            className="text-xs bg-neon-green/10 border border-neon-green/40 text-neon-green px-4 py-1.5 rounded hover:bg-neon-green/20 font-semibold transition-colors"
          >
            Sign In with Google
          </button>
        )}
      </div> {/* <-- This closing div was missing! */}
    </nav>
  );
}