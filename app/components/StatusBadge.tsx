export default function StatusBadge({ status }: { status: string }) {
  const baseClasses =
    "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold transition";

  if (
    status === "STATUS_IN_PROGRESS" ||
    status === "STATUS_HALFTIME" ||
    status === "STATUS_END_PERIOD"
  ) {
    return (
      <span className={`${baseClasses} bg-green-400 text-white animate-pulse`}>
        {status === "STATUS_HALFTIME"
          ? "HALFTIME"
          : status === "STATUS_END_PERIOD"
          ? "END QTR"
          : "LIVE"}
      </span>
    );
  }

  if (status === "STATUS_FINAL") {
    return (
      <span className={`${baseClasses} bg-red-600 text-white`}>FINAL</span>
    );
  }

  return (
    <span className={`${baseClasses} bg-blue-500 text-white`}>SCHEDULED</span>
  );
}
