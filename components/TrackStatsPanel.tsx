 "use client";

 import { useStore } from "@/lib/store";
 import {
   ArrowPathIcon,
   BoltIcon,
   ClockIcon,
   MapPinIcon,
 } from "@heroicons/react/24/solid";

 export function TrackStatsPanel() {
   const tracks = useStore((state) => state.tracks);

   if (tracks.length === 0) {
     return (
       <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-500">
         <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
           Track statistics
         </h2>
         <p>No tracks yet. Upload GPX files to see per-track distance, duration, and speed.</p>
       </aside>
     );
   }

   return (
     <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/80 shadow-[var(--shadow-card)] px-4 py-4">
       <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">
         Track statistics
       </h2>
       <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
         {tracks.map((t: any) => (
           <div
             key={t.name}
             className="flex rounded-lg border border-slate-100 bg-white/90 overflow-hidden"
           >
             <div
               className="w-1.5 flex-shrink-0"
               style={{ backgroundColor: t.color }}
             />
             <div className="flex-1 p-3">
               <div className="font-medium text-slate-900 truncate mb-2 text-sm">
                 {t.name}
               </div>
               <ul className="space-y-1.5 text-xs text-slate-600">
                 <li className="flex items-center gap-1.5">
                   <MapPinIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                   <span>{t.stats?.distanceKm.toFixed(2)} km</span>
                 </li>
                 <li className="flex items-center gap-1.5">
                   <ClockIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                   <span>{t.stats?.durationH.toFixed(2)} h</span>
                 </li>
                 <li className="flex items-center gap-1.5">
                   <BoltIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                   <span>{t.stats?.avgSpeed.toFixed(2)} km/h avg</span>
                 </li>
                 <li className="flex items-center gap-1.5">
                   <ArrowPathIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                   <span>{t.points.length} points</span>
                 </li>
               </ul>
             </div>
           </div>
         ))}
       </div>
     </aside>
   );
 }

