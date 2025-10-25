"use client";

import { useEffect, useMemo, useState } from "react";
import PollCard from "@/components/PollCard";
import { API_BASE, api } from "@/components/utils";

type Option = { id: number; text: string; votes: number };
type Poll = { id: number; question: string; author?: string | null; likes: number; options: Option[] };

export default function Page(){
  const [polls, setPolls] = useState<Poll[]>([]);

  function upsert(updated: Poll){
    setPolls(prev => {
      const idx = prev.findIndex(p => p.id === updated.id);
      if (idx === -1) return [updated, ...prev];
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });
  }

  useEffect(()=>{
    // initial fetch
    api<Poll[]>("/polls").then(setPolls).catch(console.error);

    // websocket live updates
    const ws = new WebSocket(API_BASE.replace("http","ws") + "/ws");
    ws.onmessage = (ev)=>{
      try{
        const msg = JSON.parse(ev.data);
        if(msg.type === "poll_created"){
          upsert(msg.poll);
        } else if (msg.type === "vote"){
          setPolls(prev => prev.map(p => {
            if (p.id !== msg.poll_id) return p;
            const opts = p.options.map(o => o.id === msg.option_id ? {...o, votes: msg.votes} : o);
            return { ...p, options: opts };
          }));
        } else if (msg.type === "like"){
          setPolls(prev => prev.map(p => p.id === msg.poll_id ? { ...p, likes: msg.likes } : p));
        }
      }catch(e){ console.error(e); }
    };
    ws.onerror = console.error;
    return ()=>ws.close();
  },[]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Real-time <span className="bg-hero-gradient bg-clip-text text-transparent">QuickPolls</span>
        </h1>
        <p className="mt-3 text-white/70">
          Create, vote, like — and watch updates roll in live.
        </p>
        <div className="mt-6">
          <a href="/create" className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary/20">
            + Create a Poll
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        {polls.map(p => <PollCard key={p.id} poll={p} onChanged={()=>{}} />)}
        {polls.length === 0 && <p className="text-white/60">No polls yet. Be the first to <a className="underline" href="/create">create one</a>!</p>}
      </section>
    </div>
  );
}
