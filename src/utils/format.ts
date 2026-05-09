export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

export const formatDateRange = (s: string, e: string) => {
  const sd = new Date(s);
  const ed = new Date(e);
  const sameMonth = sd.getMonth() === ed.getMonth();
  const month = sd.toLocaleString([], { month: "short" });
  const month2 = ed.toLocaleString([], { month: "short" });
  if (sameMonth) return `${month} ${sd.getDate()}–${ed.getDate()}, ${ed.getFullYear()}`;
  return `${month} ${sd.getDate()} – ${month2} ${ed.getDate()}, ${ed.getFullYear()}`;
};
