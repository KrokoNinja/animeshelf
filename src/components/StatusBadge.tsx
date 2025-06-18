import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const statuses = {
  "current": "bg-green-500 text-white hover:bg-green-500 hover:text-white",
  "upcoming": "bg-yellow-500 text-white hover:bg-yellow-500 hover:text-white",
  "finished": "bg-green-800 text-white hover:bg-green-800 hover:text-white",
  "tba": "bg-gray-500 text-white hover:bg-gray-500 hover:text-white",
  "unreleased": "bg-gray-500 text-white hover:bg-gray-500 hover:text-white",
}

export default function StatusBadge({ status }: { status: string }) {
  return <Badge className={cn(statuses[status as keyof typeof statuses], "h-fit")}>{status}</Badge>
}