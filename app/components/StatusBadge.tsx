interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "STATUS_SCHEDULED":
        return { text: "Scheduled", color: "bg-blue-100 text-blue-800" };
      case "STATUS_IN_PROGRESS":
        return { text: "Live", color: "bg-green-100 text-green-800" };
      case "STATUS_FINAL":
        return { text: "Final", color: "bg-red-100 text-red-800" };
      case "STATUS_FULL_TIME":
        return { text: "Final", color: "bg-red-100 text-red-800" };
      case "STATUS_HALFTIME":
        return { text: "Half", color: "bg-yellow-100 text-yellow-800" };
      case "STATUS_END_PERIOD":
        return { text: "End Q", color: "bg-orange-100 text-orange-800" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <span
      className={`px-2 py-1 text-xs font-bold rounded-full ${statusInfo.color}`}
    >
      {statusInfo.text}
    </span>
  );
}
