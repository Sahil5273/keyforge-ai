import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

interface ScoreData {
  id: string;
  wpm: number;
  accuracy: number;
  timestamp: Date | null;
}

export default function Profile() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ high: 0, avg: 0, total: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "scores"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedScores: ScoreData[] = [];
        let maxWpm = 0;
        let sumWpm = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedScores.push({
            id: doc.id,
            wpm: data.wpm,
            accuracy: data.accuracy,
            timestamp: data.timestamp ? data.timestamp.toDate() : null,
          });
          if (data.wpm > maxWpm) maxWpm = data.wpm;
          sumWpm += data.wpm;
        });

        setScores(fetchedScores);
        setStats({
          high: maxWpm,
          avg: fetchedScores.length > 0 ? Math.round(sumWpm / fetchedScores.length) : 0,
          total: fetchedScores.length
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Refetch if the auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData();
      else { setScores([]); setLoading(false); }
    });

    return () => unsubscribe();
  }, []);

  const user = auth.currentUser;

  if (loading) return <div className="p-8 text-center text-neon-green mt-20 font-mono">Loading profile...</div>;

  if (!user) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-neon-green mb-4">Profile Access Denied</h1>
        <p className="text-gray-400 border border-zinc-800 p-8 rounded bg-zinc-900/50">
          Please sign in to view your profile and test history.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: User Card */}
      <div className="md:col-span-1 bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6 flex flex-col items-center shadow-xl h-fit">
        <img 
          src={user.photoURL || "https://via.placeholder.com/150"} 
          alt="Profile" 
          className="w-32 h-32 rounded-full border-4 border-neon-green mb-4 shadow-[0_0_15px_rgba(0,255,65,0.3)] object-cover"
        />
        <h2 className="text-2xl font-bold text-white mb-1 text-center">{user.displayName}</h2>
        <p className="text-zinc-400 text-sm mb-6 text-center">{user.email}</p>

        <div className="w-full space-y-3">
          <div className="bg-black/40 p-4 rounded border border-zinc-800 text-center">
            <p className="text-zinc-500 text-xs mb-1 font-mono tracking-wider">HIGHEST WPM</p>
            <p className="text-3xl font-bold text-neon-green">{stats.high}</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-zinc-800 text-center">
            <p className="text-zinc-500 text-xs mb-1 font-mono tracking-wider">AVERAGE WPM</p>
            <p className="text-2xl font-bold text-white">{stats.avg}</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-zinc-800 text-center">
            <p className="text-zinc-500 text-xs mb-1 font-mono tracking-wider">TESTS COMPLETED</p>
            <p className="text-xl font-bold text-zinc-300">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Right Column: History Table */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-neon-green mb-6 border-b border-zinc-800 pb-2">Test History</h2>
        
        {scores.length === 0 ? (
          <div className="text-center p-12 border border-zinc-800 rounded bg-[#1E1E1E]">
            <p className="text-gray-400">No tests completed yet. Head to the Arena!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#1E1E1E] shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-zinc-800 text-gray-400 font-mono text-sm tracking-wider">
                  <th className="p-4 font-medium">DATE</th>
                  <th className="p-4 font-medium">SPEED</th>
                  <th className="p-4 font-medium">ACCURACY</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 text-gray-300 text-sm">
                      {score.timestamp 
                        ? score.timestamp.toLocaleDateString() + ' ' + score.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                        : "Just now"}
                    </td>
                    <td className="p-4 font-bold text-neon-green">{score.wpm} WPM</td>
                    <td className="p-4 text-gray-300">{score.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}