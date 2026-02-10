 "use client";

 import { useStore } from "@/lib/store";
 import { trackSimilarity } from "@/utils/gpx";
 import { UsersIcon } from "@heroicons/react/24/solid";

 export function TrackSimilarityPanel() {
   const tracks = useStore((state) => state.tracks);

   if (tracks.length < 2) {
     return (
       <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-500">
         <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
           Track similarity
         </h2>
         <p>Upload at least two tracks to compare how closely they match.</p>
       </aside>
     );
   }

   return (
     <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/80 shadow-[var(--shadow-card)] px-4 py-4">
       <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">
         Track similarity
       </h2>
       <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
         {tracks.map((t1, i) =>
           tracks.map((t2, j) => {
             if (i >= j) return null;
             const score = trackSimilarity(t1.points, t2.points);
             return (
               <div
                 key={`${i}-${j}`}
                 className="flex items-center gap-3 rounded-md border border-slate-100 bg-white/95 px-3 py-2"
               >
                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600">
                   <UsersIcon className="w-4 h-4" />
                 </span>
                 <div className="flex-1 min-w-0">
                   <span className="font-medium text-slate-800 truncate block text-xs">
                     {t1.name} ↔ {t2.name}
                   </span>
                   <span className="text-[11px] text-slate-500">Similarity</span>
                 </div>
                 <span className="text-sm font-semibold tabular-nums text-teal-600">
                   {score}%
                 </span>
               </div>
             );
           }),
         )}
       </div>
     </aside>
   );
 }

