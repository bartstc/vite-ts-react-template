import { vi } from "vitest";

import { toaster } from "@/lib/components/Toast/use-toast";

export const spyOnToast = () => vi.spyOn(toaster, "create");
