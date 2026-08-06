import React from "react";
import {
  useAdminTranslation,
  useRecentActivity,
} from "@/features/admin-dashboard/hooks";
import { Store, ShoppingCart, ShieldCheck, UserCheck, Clock, Sparkles } from "lucide-react";

const RecentActivity: React.FC = () => {
  const { t } = useAdminTranslation();
  const { activities, isLoading } = useRecentActivity();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full min-h-[380px] justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            {t.dashboard.recent_activity.title}
          </h3>
          <button className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline cursor-pointer">
            {t.dashboard.recent_activity.view_all}
          </button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] no-scrollbar">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-3.5 items-center">
                    <div className="size-9 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-full bg-slate-100 animate-pulse rounded-full" />
                      <div className="h-2 w-1/2 bg-slate-100 animate-pulse rounded-full" />
                    </div>
                  </div>
                ))
            : activities.map((act) => {
                const getIcon = () => {
                  if (act.type === "vendor_registration") return <Store className="size-4" />;
                  if (act.type === "order") return <ShoppingCart className="size-4" />;
                  if (act.type === "kyc_update") return <ShieldCheck className="size-4" />;
                  return <UserCheck className="size-4" />;
                };

                return (
                  <div key={act.id} className="flex gap-3 items-center group cursor-default p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div
                      className={`size-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/60 transition-transform group-hover:scale-105 ${
                        act.type === "vendor_registration"
                          ? "bg-emerald-50 text-emerald-600"
                          : act.type === "order"
                            ? "bg-orange-50 text-orange-600"
                            : act.type === "kyc_update"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 leading-snug">
                        <span className="font-bold text-slate-900">{act.user}</span> {act.action}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <Clock className="size-3 text-slate-300" />
                          {act.time}
                        </span>
                        {act.status === "pending" && (
                          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
