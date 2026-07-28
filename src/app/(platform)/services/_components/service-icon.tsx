import { Box, Building2, Home, MessagesSquare } from "lucide-react";

import type { Service } from "@/data";

/**
 * Resolves the icon name stored on a service into a lucide component, keeping
 * the data module free of React imports.
 */
const ICONS = {
  Home,
  Building2,
  Box,
  MessagesSquare,
} as const;

export function ServiceIcon({
  name,
  className,
}: {
  name: Service["icon"];
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
