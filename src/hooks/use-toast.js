import { toast as sonnerToast } from "sonner";

/**
 * Lightweight adapter to mimic the shadcn/ui toast API using sonner.
 * Accepts objects with { title, description, variant } and routes to sonner.
 */
export function useToast() {
  const toast = (options = {}) => {
    const { title, description, variant, ...rest } = options;

    if (variant === "destructive") {
      return sonnerToast.error(title || "Error", {
        description,
        ...rest,
      });
    }

    // Default to success/info
    return sonnerToast.success(title || "Success", {
      description,
      ...rest,
    });
  };

  return { toast };
}

export default useToast;

