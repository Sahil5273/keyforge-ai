import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto mt-10 animate-fade-in mb-20">
      <h1 className="text-4xl font-bold text-white mb-2">
        About <span className="text-neon-green">KeyForge AI</span>
      </h1>
      <p className="text-gray-400 mb-12 font-mono">v1.0.0 | Built by Sahil Kumar</p>

      {/* The Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">The Mission</h2>
        <p className="text-gray-300 leading-relaxed bg-[#1E1E1E] p-6 rounded-lg border border-zinc-800">
          KeyForge AI was built to solve a simple problem: standard typing tests don't reflect how developers actually type. 
          By combining a custom-built code-typing arena with advanced analytics, this platform helps developers 
          track their speed, analyze their accuracy, and predict their future performance using machine learning.
        </p>
      </section>

      {/* The Tech Stack Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">The Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1E1E1E] p-6 rounded-lg border border-zinc-800">
            <h3 className="text-neon-green font-bold mb-2">Frontend</h3>
            <ul className="text-gray-300 space-y-2 font-mono text-sm">
              <li>• React 18</li>
              <li>• TypeScript</li>
              <li>• Vite (Build Tool)</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          <div className="bg-[#1E1E1E] p-6 rounded-lg border border-zinc-800">
            <h3 className="text-neon-green font-bold mb-2">Backend & Auth</h3>
            <ul className="text-gray-300 space-y-2 font-mono text-sm">
              <li>• Firebase Auth (Google)</li>
              <li>• Firestore (NoSQL Database)</li>
              <li>• Firebase Hosting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The AI Engine Section (Highlighted) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-neon-green mb-4 border-b border-neon-green/30 pb-2 flex items-center">
          <span className="mr-2">🧠</span> The AI Prediction Engine
        </h2>
        <div className="bg-black/40 p-8 rounded-lg border border-neon-green/50 shadow-[0_0_15px_rgba(0,255,65,0.1)] relative overflow-hidden">
          
          <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
            The core feature of KeyForge AI is its predictive model. Rather than just showing past scores, 
            the engine uses <strong className="text-white">Linear Regression</strong> to forecast what a user's 
            Words Per Minute (WPM) will be on their next attempt based on their historical trajectory.
          </p>

          <h3 className="text-white font-bold mb-2 relative z-10">Feature Engineering: Effective WPM</h3>
          <p className="text-gray-400 text-sm mb-6 relative z-10">
            Raw speed isn't enough. If a user types 110 WPM but with 17% accuracy, they aren't actually typing well. 
            Before running the regression math, the AI calculates an <strong>Effective WPM</strong> by penalizing low-accuracy scores: 
            <br/><br/>
            <code className="bg-zinc-900 text-neon-green px-2 py-1 rounded">Effective WPM = Raw WPM × (Accuracy / 100)</code>
          </p>

          <h3 className="text-white font-bold mb-2 relative z-10">The Mathematics</h3>
          <p className="text-gray-400 text-sm mb-4 relative z-10">
            The engine plots the user's Effective WPM history on a graph and calculates the line of best fit using the slope-intercept formula (y = mx + b).
          </p>
          
          <div className="bg-zinc-900 p-4 rounded font-mono text-xs text-gray-400 border border-zinc-800 relative z-10 overflow-x-auto">
            <p>m = (n(Σxy) - (Σx)(Σy)) / (n(Σx²) - (Σx)²)</p>
            <p>b = (Σy - m(Σx)) / n</p>
            <p className="mt-2 text-neon-green">// Where 'x' is the test number and 'y' is the Effective WPM</p>
          </div>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/" className="text-gray-400 hover:text-neon-green font-mono transition-colors border-b border-transparent hover:border-neon-green pb-1">
          &lt;- Return to Arena
        </Link>
      </div>
    </div>
  );
}