import React from "react";
import {
  useAdminTranslation,
  useRecentActivity,
} from "@/features/admin-dashboard/hooks";

const RecentActivity: React.FC = () => {
  const { t } = useAdminTranslation();
  const { activities, isLoading } = useRecentActivity();

  return (
    <div className="bg-(--card-bg) p-6 rounded-2xl border border-(--border-sep) shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-black text-(--deep-blue) tracking-tight">
          {t.dashboard.recent_activity.title}
        </h3>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
          {t.dashboard.recent_activity.view_all}
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="size-10 rounded-full skeleton shrink-0" />
                  <div className="flex-1 space-y-2 mt-1">
                    <div className="h-2 w-full skeleton rounded-full" />
                    <div className="h-2 w-1/2 skeleton rounded-full opacity-60" />
                  </div>
                </div>
              ))
          : activities.map((act) => (
              <div key={act.id} className="flex gap-4 group cursor-default">
                <div
                  className={`size-10 rounded-full flex items-center justify-center shrink-0 border border-slate-50 transition-transform group-hover:scale-110 ${
                    act.type === "vendor_registration"
                      ? "bg-emerald-50 text-emerald-600"
                      : act.type === "order"
                        ? "bg-blue-50 text-blue-600"
                        : act.type === "kyc_update"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {act.type === "vendor_registration"
                      ? "storefront"
                      : act.type === "order"
                        ? "shopping_cart"
                        : act.type === "kyc_update"
                          ? "verified_user"
                          : "person"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-(--deep-blue) leading-snug">
                    <span className="font-black">{act.user}</span> {act.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-(--text-muted) font-bold opacity-60">
                      {act.time}
                    </span>
                    {act.status === "pending" && (
                      <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default RecentActivity;
