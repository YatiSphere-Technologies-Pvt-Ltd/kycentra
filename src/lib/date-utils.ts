/** Parse "2h 15m", "45 min", "30 min" → total minutes */
export function parseTimePending(time: string): number {
  const hours = time.match(/(\d+)h/);
  const mins = time.match(/(\d+)\s*min/);
  return (hours ? parseInt(hours[1]) * 60 : 0) + (mins ? parseInt(mins[1]) : 0);
}

/** Format a greeting based on time of day */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Format current date for display */
export function formatCurrentDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
