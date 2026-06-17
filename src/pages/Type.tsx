import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const SAMPLE_CODE = `function calculateWPM(chars, time) {
  const words = chars / 5;
  const minutes = time / 60;
  return Math.round(words / minutes);
}`;

export default function Type() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Tracks if we are saving to the DB
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (input.length > 0) {
      let correctChars = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === SAMPLE_CODE[i]) correctChars++;
      }
      setAccuracy(Math.round((correctChars / input.length) * 100));

      if (startTime) {
        const timeElapsedInMinutes = (Date.now() - startTime) / 1000 / 60;
        const wordsTyped = input.length / 5;
        if (timeElapsedInMinutes > 0) {
          setWpm(Math.round(wordsTyped / timeElapsedInMinutes));
        }
      }
    }

    // Trigger save when test is finished
    if (input.length === SAMPLE_CODE.length && !isFinished) {
      setIsFinished(true);
      saveScoreToDatabase();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, startTime, isFinished]);

  // The function that pushes data to Firestore
  const saveScoreToDatabase = async () => {
    const user = auth.currentUser;
    if (!user) return; // Don't save if they aren't logged in

    setIsSaving(true);
    try {
      await addDoc(collection(db, "scores"), {
        userId: user.uid,
        displayName: user.displayName || "Anonymous Typist",
        photoURL: user.photoURL || "",
        wpm: wpm,
        accuracy: accuracy,
        timestamp: serverTimestamp(),
      });
      console.log("Score saved successfully!");
    } catch (error) {
      console.error("Error saving score: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div 
      className="flex flex-col items-center p-8 max-w-4xl mx-auto min-h-[80vh] justify-center cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex w-full justify-between mb-8 text-xl font-mono border-b border-zinc-800 pb-4">
        <div className="text-gray-400">
          WPM: <span className="text-neon-green font-bold text-2xl">{wpm}</span>
        </div>
        <div className="text-gray-400">
          Accuracy: <span className="text-neon-green font-bold text-2xl">{accuracy}%</span>
        </div>
      </div>

      <div className="relative w-full bg-[#1E1E1E] p-8 rounded-lg shadow-2xl font-mono text-xl leading-relaxed whitespace-pre-wrap tracking-wide border border-zinc-800">
        {SAMPLE_CODE.split("").map((char, index) => {
          let colorClass = "text-gray-500";
          if (index < input.length) {
            colorClass = input[index] === char ? "text-gray-200" : "text-red-500 bg-red-500/20";
          }
          const isCurrentChar = index === input.length && !isFinished;
          return (
            <span key={index} className={`${colorClass} ${isCurrentChar ? "border-b-2 border-neon-green animate-pulse" : ""}`}>
              {char}
            </span>
          );
        })}

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            if (!isFinished) setInput(e.target.value);
          }}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text resize-none"
          spellCheck="false"
          autoCapitalize="none"
          autoComplete="off"
        />
      </div>

      <button onClick={handleRestart} className="mt-8 px-6 py-2 border border-zinc-700 hover:border-neon-green text-gray-400 hover:text-neon-green rounded transition-colors font-mono cursor-pointer z-10">
        Restart Test [Esc]
      </button>

      {isFinished && (
        <div className="mt-8 p-6 bg-neon-green/10 border border-neon-green rounded-lg text-center animate-fade-in z-10">
          <h2 className="text-2xl font-bold text-neon-green mb-2">Test Complete!</h2>
          <p className="text-gray-300 mb-2">
            Final Speed: <span className="font-bold">{wpm} WPM</span> | Accuracy: <span className="font-bold">{accuracy}%</span>
          </p>
          {/* Notify the user if the score is saving, saved, or if they need to log in */}
          {auth.currentUser ? (
            <p className="text-sm text-neon-green/70">
              {isSaving ? "Saving to Leaderboard..." : "✓ Score saved to Leaderboard!"}
            </p>
          ) : (
            <p className="text-sm text-red-400">Sign in to save your score to the Leaderboard.</p>
          )}
        </div>
      )}
    </div>
  );
}