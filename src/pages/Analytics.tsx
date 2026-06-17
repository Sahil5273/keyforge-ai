import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

// Define what our score data looks like for TypeScript
interface ScoreData {
  id: string;
  wpm: number;
  accuracy: number;
  timestamp: Date | null;
}

export default function Analytics() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserHistory = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Query: Find scores matching this user, ordered by newest first
        const q = query(
          collection(db, "scores"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedScores: ScoreData[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedScores.push({
            id: doc.id,
            wpm: data.wpm,
            accuracy: data.accuracy,
            // Convert Firestore timestamp to a standard JavaScript Date
            timestamp: data.timestamp ? data.timestamp.toDate() : null,
          });
        });

        setScores(fetchedScores);
      } catch (error: any) {
        console.error("Error fetching history:", error);
        // We will talk about a specific Firestore error below!
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes so we fetch data immediately after login
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserHistory();
      } else {
        setScores([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-neon-green font-mono mt-20">Loading your history...</div>;
  }

  // If the user is logged out, show a message instead of an empty table
  if (!auth.currentUser) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-neon-green mb-4">Personal History</h1>
        <p className="text-gray-400 border border-zinc-800 p-8 rounded bg-zinc-900/50">
          Please sign in to view your typing history.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-neon-green mb-2">Your Typing History</h1>
      <p className="text-gray-400 mb-8">Track your WPM and accuracy over time.</p>

      {scores.length === 0 ? (
        <div className="text-center p-12 border border-zinc-800 rounded bg-[#1E1E1E]">
          <p className="text-gray-400">You haven't completed any typing tests yet. Head to the Arena!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#1E1E1E] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-zinc-800 text-gray-400 font-mono text-sm tracking-wider">
                <th className="p-4 font-medium">DATE & TIME</th>
                <th className="p-4 font-medium">SPEED (WPM)</th>
                <th className="p-4 font-medium">ACCURACY</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 text-gray-300 text-sm">
                    {score.timestamp ? score.timestamp.toLocaleString() : "Just now"}
                  </td>
                  <td className="p-4 font-bold text-neon-green text-lg">{score.wpm}</td>
                  <td className="p-4 text-gray-300">{score.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}