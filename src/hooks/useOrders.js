import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// ORDERS RECEIVED HOOKS
// ============================================================================

export function useOrdersReceived() {
  return useQuery({
    queryKey: ["orders-received"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders_received")
        .select("*")
        .order("order_number", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateOrderReceived() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData) => {
      const { data, error } = await supabase
        .from("orders_received")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders-received"]);
      toast({
        title: "Success",
        description: "Order received created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateOrderReceived() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("orders_received")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders-received"]);
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteOrderReceived() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("orders_received")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders-received"]);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// ORDERS PLACED HOOKS
// ============================================================================

export function useOrdersPlaced() {
  return useQuery({
    queryKey: ["orders-placed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders_placed")
        .select("*")
        .order("order_number", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateOrderPlaced() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData) => {
      const { data, error } = await supabase
        .from("orders_placed")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders-placed"]);
      toast({
        title: "Success",
        description: "Order placed created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateOrderPlaced() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("orders_placed")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders-placed"]);
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteOrderPlaced() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("orders_placed")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders-placed"]);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// FULFILLMENT LINKS HOOKS
// ============================================================================

export function useFulfillmentLinks() {
  return useQuery({
    queryKey: ["fulfillment-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_fulfillment_links")
        .select(
          `
          *,
          orders_received:order_received_id(*),
          orders_placed:order_placed_id(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateFulfillmentLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (linkData) => {
      const { data, error } = await supabase
        .from("order_fulfillment_links")
        .insert([linkData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fulfillment-links"]);
      queryClient.invalidateQueries(["orders-received"]);
      queryClient.invalidateQueries(["orders-placed"]);
      toast({
        title: "Success",
        description: "Fulfillment link created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFulfillmentLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("order_fulfillment_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fulfillment-links"]);
      queryClient.invalidateQueries(["orders-received"]);
      queryClient.invalidateQueries(["orders-placed"]);
      toast({
        title: "Success",
        description: "Fulfillment link deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
