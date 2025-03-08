export function OrderStatusBadge({ status }) {
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const statusText = {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      delivered: "Delivered",
      cancelled: "Cancelled",
      failed: "Failed",
    };
    return statusText[status?.toLowerCase()] || status;
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
} 