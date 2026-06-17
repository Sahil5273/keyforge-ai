import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Prediction() {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [trend, setTrend] = useState<"improving" | "declining" | "stable" | null>(null);
  const [testCount, setTestCount] = useState(0);

  useEffect(() => {
    const calculatePrediction = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch history, oldest first so we can graph improvement over time
        const q = query(
          collection(db, "scores"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "asc")
        );

        const querySnapshot = await getDocs(q);
        const scores: number[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawWpm = data.wpm;
          const accuracy = data.accuracy;

          // Calculate Effective WPM: WPM * (Accuracy as a decimal)
          // This heavily penalizes spam-typing (like 111 WPM at 17% accuracy)
          // while leaving high-accuracy tests mostly untouched.
          const effectiveWpm = rawWpm * (accuracy / 100);
          
          scores.push(effectiveWpm);
        });

        setTestCount(scores.length);

        // We need at least 2 tests to draw a line
        if (scores.length < 2) {
          setLoading(false);
          return;
        }

        // --- Linear Regression Math ---
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        const n = scores.length;

        for (let i = 0; i < n; i++) {
          const x = i + 1; // Test number (1, 2, 3...)
          const y = scores[i]; // Effective WPM

          sumX += x;
          sumY += y;
          sumXY += x * y;
          sumXX += x * x;
        }

        // Calculate slope (m) and intercept (b)
        const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const b = (sumY - m * sumX) / n;

        // Predict the NEXT test (n + 1)
        const nextX = n + 1;
        const predictedY = Math.round(m * nextX + b);

        // Prevent negative predictions just in case
        setPrediction(predictedY > 0 ? predictedY : 0);

        if (m > 0.5) setTrend("improving");
        else if (m < -0.5) setTrend("declining");
        else setTrend("stable");

      } catch (error) {
        console.error("Error predicting score:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) calculatePrediction();
      else setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-neon-green mt-20 font-mono">Running AI models...</div>;
  }

  if (!auth.currentUser) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-neon-green mb-4">AI Prediction Locked</h1>
        <p className="text-gray-400 border border-zinc-800 p-8 rounded bg-zinc-900/50">
          Please sign in to access your WPM predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto mt-10 animate-fade-in">
      <div className="border border-zinc-800 bg-[#1E1E1E] rounded-lg p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-green/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-green/5 rounded-full blur-3xl"></div>

        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">Next Test Prediction</h1>
        <p className="text-gray-400 mb-8 font-mono text-sm relative z-10">Powered by Linear Regression</p>

        {testCount < 2 ? (
          <div className="bg-black/40 border border-zinc-800 p-6 rounded relative z-10">
            <p className="text-gray-300">
              The engine needs more data. You have completed <span className="text-neon-green font-bold">{testCount}</span> tests. 
              Complete at least 2 tests to unlock predictions.
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <div className="flex flex-col items-center justify-center">
              <span className="text-zinc-500 font-mono text-sm tracking-widest mb-2">TARGET WPM</span>
              <span className="text-7xl font-bold text-neon-green drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
                {prediction}
              </span>
            </div>

            <div className="inline-block bg-black/40 border border-zinc-800 px-6 py-3 rounded-full mt-4">
              <span className="text-gray-300 mr-2">Current Trend:</span>
              {trend === "improving" && <span className="text-neon-green font-bold">↑ Improving</span>}
              {trend === "declining" && <span className="text-red-500 font-bold">↓ Declining</span>}
              {trend === "stable" && <span className="text-yellow-500 font-bold">→ Stable</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}