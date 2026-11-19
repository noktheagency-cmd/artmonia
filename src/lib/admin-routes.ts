export const adminViews = ["dashboard", "homepage", "certificates", "news", "blog", "home_results", "results", "awards", "metadata", "media", "messages", "settings"] as const;
export type AdminView = typeof adminViews[number];

export function isAdminView(value: string): value is AdminView {
  return adminViews.some(view => view === value);
}

export function adminHref(view: AdminView) {
  return view === "dashboard" ? "/admin" : `/admin/${view}`;
}
