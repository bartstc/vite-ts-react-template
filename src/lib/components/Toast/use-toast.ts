import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

interface ToastOptions {
  status?: "success" | "error" | "warning" | "info" | "loading";
  title?: string;
  description?: string;
  duration?: number;
}

export const useToast = () => {
  return (options: ToastOptions) => {
    toaster.create({
      type: options.status,
      title: options.title,
      description: options.description,
      duration: options.duration ?? 5000,
      closable: true,
    });
  };
};
