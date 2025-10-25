"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { API_BASE, api, getUserKey } from "./utils";

type Option = { id: number; text: string; votes: number };
type Poll = { id: number; question: string; author?: string | null; likes: number; options: Option[] };

export default function PollCard({ poll, onChanged }:{ poll: Poll; onChanged: (p: Poll) => void }) {
  const [loading, setLoading] = useState(false);
  const total = poll.options.reduce((a,b)=>a+b.votes,0) || 1;

  async function vote(option_id:number){
    setLoading(true);
    try{
      await api(`/polls/${poll.id}/vote`, { method:"POST", body: JSON.stringify({ option_id, user_key: getUserKey() })});
    } finally {
      setLoading(false);
    }
  }
  async function like(){
    setLoading(true);
    try{
      await api(`/polls/${poll.id}/like`, { method:"POST", body: JSON.stringify({ user_key: getUserKey() })});
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold">{poll.question}</h3>
          {poll.author && <p className="text-white/60 text-sm mt-1">by {poll.author}</p>}
        </div>
        <button onClick={like} disabled={loading} className="px-3 py-2 rounded-xl bg-accent/90 hover:bg-accent transition">
          ❤️ {poll.likes}
        </button>
      </div>

      <div className="space-y-3">
        {poll.options.map((opt) => {
          const pct = Math.round((opt.votes/total)*100);
          return (
            <button key={opt.id} disabled={loading} onClick={()=>vote(opt.id)} className="w-full text-left">
              <div className="mb-1 flex justify-between text-sm text-white/80">
                <span>{opt.text}</span><span>{pct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div<HTMLDivElement>
                className="h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{ backgroundImage: "linear-gradient(90deg, #7C3AED, #DB2777)" }}
              />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
