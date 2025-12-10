import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { orderPlacedSchema } from "@/schemas/orderSchemas";
import {
  useOrdersPlaced,
  useCreateOrderPlaced,
  useUpdateOrderPlaced,
  useDeleteOrderPlaced,
} from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const defaultValues = {
  party_name: "",
  item_name: "",
  sku: "",
  ordered_quantity: 1,
  received_quantity: "",
  unit: "mtrs",
  rate: "",
  notes: "",
  custom_fields: {},
};

const updateReceivedSchema = z.object({
  received_quantity: z.coerce.number().nonnegative("Cannot be negative"),
});

export default function OrdersPlaced() {
  const { data, isLoading, error } = useOrdersPlaced();
  const createMutation = useCreateOrderPlaced();
  const updateMutation = useUpdateOrderPlaced();
  const deleteMutation = useDeleteOrderPlaced();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const form = useForm({
    resolver: zodResolver(orderPlacedSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      received_quantity:
        values.received_quantity === "" ? null : values.received_quantity,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        form.reset(defaultValues);
        setCreateOpen(false);
      },
    });
  });

  const updateForm = useForm({
    resolver: zodResolver(updateReceivedSchema),
    defaultValues: { received_quantity: 0 },
  });

  useEffect(() => {
    if (editingOrder) {
      updateForm.reset({
        received_quantity:
          editingOrder.received_quantity ?? editingOrder.ordered_quantity ?? 0,
      });
    }
  }, [editingOrder, updateForm]);

  const onUpdateReceived = updateForm.handleSubmit((values) => {
    if (!editingOrder?.id) return;
    updateMutation.mutate(
      { id: editingOrder.id, updates: { received_quantity: values.received_quantity } },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingOrder(null);
        },
      }
    );
  });

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Orders Placed</CardTitle>
              <CardDescription>Data from Supabase `orders_placed`.</CardDescription>
            </div>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>Add supplier order</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add supplier order</DialogTitle>
                  <DialogDescription>
                    Log what you ordered from suppliers.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    className="grid gap-4 md:grid-cols-2"
                    onSubmit={onSubmit}
                  >
                    <FormField
                      name="party_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party</FormLabel>
                          <FormControl>
                            <Input placeholder="Party name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="item_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item</FormLabel>
                          <FormControl>
                            <Input placeholder="Item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="sku"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="ordered_quantity"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ordered Qty</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="received_quantity"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Optional"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="unit"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="mtrs" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="rate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="notes"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Any notes about the order"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="md:col-span-2 gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setCreateOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error.message}</p>
          ) : data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Party</TableHead>
                  <TableHead>Item</TableHead>
                    <TableHead>Date</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead>Received</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((order) => (
                    <TableRow
                      key={order.id ?? order.order_number}
                      className={
                        order.status === "fulfilled"
                          ? "bg-emerald-50"
                          : (order.remaining_quantity ?? 0) < 0
                          ? "bg-rose-50"
                          : "bg-white"
                      }
                    >
                    <TableCell className="font-medium">
                      {order.party_name}
                    </TableCell>
                    <TableCell>{order.item_name}</TableCell>
                      <TableCell>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    <TableCell>{order.ordered_quantity}</TableCell>
                    <TableCell>
                      {order.received_quantity ?? "—"}
                    </TableCell>
                      <TableCell>
                        {order.remaining_quantity ??
                          order.received_quantity ??
                          order.ordered_quantity ??
                          "—"}
                      </TableCell>
                      <TableCell>{order.status ?? "confirmed"}</TableCell>
                    <TableCell>{order.unit}</TableCell>
                    <TableCell>{order.rate ?? "-"}</TableCell>
                    <TableCell className="max-w-[240px] truncate">
                      {order.notes ?? "-"}
                    </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingOrder(order);
                            setDialogOpen(true);
                          }}
                        >
                          Update received
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() =>
                            deleteMutation.mutate(order.id ?? order.order_number)
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600">No orders found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update received quantity</DialogTitle>
            <DialogDescription>
              Set the received quantity based on the supplier invoice.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form className="space-y-4" onSubmit={onUpdateReceived}>
              <FormField
                name="received_quantity"
                control={updateForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {editingOrder ? (
                <p className="text-xs text-muted-foreground">
                  Ordered: {editingOrder.ordered_quantity} {editingOrder.unit} •{" "}
                  Current received: {editingOrder.received_quantity ?? "—"} •{" "}
                  Remaining: {editingOrder.remaining_quantity ?? "—"}
                </p>
              ) : null}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

