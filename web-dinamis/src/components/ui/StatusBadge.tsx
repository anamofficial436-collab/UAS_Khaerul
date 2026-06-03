import { StatusPengaduan, STATUS_LABELS } from "@/types";

interface StatusBadgeProps {
  status: StatusPengaduan;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classMap: Record<StatusPengaduan, string> = {
    menunggu: "badge-menunggu",
    diproses: "badge-diproses",
    selesai: "badge-selesai",
  };

  const dotColor: Record<StatusPengaduan, string> = {
    menunggu: "bg-yellow-500",
    diproses: "bg-blue-500",
    selesai: "bg-green-500",
  };

  return (
    <span className={classMap[status]}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
