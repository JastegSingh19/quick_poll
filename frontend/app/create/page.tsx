"use client";

import { useState } from "react";
import { api } from "@/components/utils";
import { useRouter } from "next/navigation";

export default function CreatePage(){
  const [question, setQuestion] = useState("");
  const [author, setAuthor] = useState("");
  const [options, setOptions] = useState<string[]>(["",""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function setOpt(i:number, val:string){
    setOptions(prev => prev.map((o,idx)=> idx===i?val:o));
  }

  function addOpt(){
    setOptions(prev => [...prev, ""]);
  }
  function rmOpt(i:number){
    setOptions(prev => prev.filter((_,idx)=>idx!==i));
  }

  async function submit(){
    setLoading(true);
    try{
      const payload = { question, author: author || undefined, options: options.filter(Boolean).map(t => ({text:t})) };
      const poll = await api("/polls", { method: "POST", body: JSON.stringify(payload) });
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-2xl font-bold mb-4">Create a Poll</h2>

      <label className="block text-sm mb-1">Question</label>
      <input value={question} onChange={e=>setQuestion(e.target.value)}
        className="w-full rounded-xl bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="Your question..." />

      <div className="mt-4">
        <label className="block text-sm mb-1">Author (optional)</label>
        <input value={author} onChange={e=>setAuthor(e.target.value)}
          className="w-full rounded-xl bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm">Options</label>
          <button onClick={addOpt} className="text-accent hover:text-accent-light">+ Add option</button>
        </div>
        {options.map((opt, i)=>(
          <div key={i} className="flex gap-2">
            <input value={opt} onChange={e=>setOpt(i, e.target.value)}
              className="flex-1 rounded-xl bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder={`Option ${i+1}`} />
            {options.length > 2 && (
              <button onClick={()=>rmOpt(i)} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">✕</button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button disabled={loading || question.trim().length<3 || options.filter(Boolean).length<2}
          onClick={submit}
          className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </div>
  );
}
