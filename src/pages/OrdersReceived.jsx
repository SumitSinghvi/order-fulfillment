import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  orderReceivedSchema,
  fulfillmentLinkSchema,
} from "@/schemas/orderSchemas";
import {
  useOrdersReceived,
  useCreateOrderReceived,
  useDeleteOrderReceived,
  useCreateFulfillmentLink,
  useOrdersPlaced,
} from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultValues = {
  customer_name: "",
  item_name: "",
  sku: "",
  ordered_quantity: 1,
  unit: "mtrs",
  rate: "",
  notes: "",
  custom_fields: {},
};

export default function OrdersReceived() {
  const { data, isLoading, error } = useOrdersReceived();
  const createMutation = useCreateOrderReceived();
  const deleteMutation = useDeleteOrderReceived();
  const createLinkMutation = useCreateFulfillmentLink();
  const { data: placedOrders } = useOrdersPlaced();
  const [open, setOpen] = useState(false);
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noteView, setNoteView] = useState({ open: false, content: "" });

  const form = useForm({
    resolver: zodResolver(orderReceivedSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        form.reset(defaultValues);
        setOpen(false);
      },
    });
  });

  const allocateForm = useForm({
    resolver: zodResolver(
      fulfillmentLinkSchema.pick({
        order_placed_id: true,
        quantity_fulfilled: true,
      })
    ),
    defaultValues: { order_placed_id: "", quantity_fulfilled: 1 },
  });

  const onAllocateSubmit = allocateForm.handleSubmit((values) => {
    if (!selectedOrder?.id) return;
    createLinkMutation.mutate(
      {
        order_received_id: selectedOrder.id,
        order_placed_id: values.order_placed_id,
        quantity_fulfilled: values.quantity_fulfilled,
      },
      {
        onSuccess: () => {
          allocateForm.reset({ order_placed_id: "", quantity_fulfilled: 1 });
          setAllocateOpen(false);
          setSelectedOrder(null);
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
              <CardTitle>Orders Received</CardTitle>
              <CardDescription className="hidden md:block">
                Purchase orders you have received
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add order</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add order received</DialogTitle>
                  <DialogDescription>
                    Capture what the customer ordered.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    className="grid gap-4 md:grid-cols-2"
                    onSubmit={onSubmit}
                  >
                    <FormField
                      name="customer_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer</FormLabel>
                          <FormControl>
                            <Input placeholder="Customer name" {...field} />
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
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
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
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                            />
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
                    <DialogFooter className="md:col-span-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
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
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead>Dispatched</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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
                        : "bg-white"
                    }
                  >
                    <TableCell className="font-medium">
                      {order.order_number ?? "—"}
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.item_name}</TableCell>
                    <TableCell>{order.ordered_quantity}</TableCell>
                    <TableCell>{order.dispatched_quantity ?? "—"}</TableCell>
                    <TableCell>{order.status ?? "confirmed"}</TableCell>
                    <TableCell>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{order.rate ?? "-"}</TableCell>
                    <TableCell className="max-w-[200px]">
                      {order.notes ? (
                        <div className="flex items-start gap-2">
                          <span className="inline-block line-clamp-1">
                            {order.notes}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() =>
                              setNoteView({
                                open: true,
                                content: order.notes,
                              })
                            }
                            aria-label="View notes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setAllocateOpen(true);
                        }}
                      >
                        Allocate
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

      <Dialog open={allocateOpen} onOpenChange={setAllocateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate supplier order</DialogTitle>
            <DialogDescription>
              Link a supplier order to this customer order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder ? (
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">
                {selectedOrder.item_name} — {selectedOrder.customer_name}
              </div>
              <div>
                Ordered: {selectedOrder.ordered_quantity} {selectedOrder.unit}
              </div>
              <div>Dispatched: {selectedOrder.dispatched_quantity ?? "—"}</div>
            </div>
          ) : null}
          <Form {...allocateForm}>
            <form className="space-y-4" onSubmit={onAllocateSubmit}>
              <FormField
                name="order_placed_id"
                control={allocateForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier order</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select supplier order" />
                        </SelectTrigger>
                        <SelectContent>
                          {placedOrders?.map((order) => (
                            <SelectItem key={order.id} value={order.id}>
                              {order.item_name} — {order.party_name} (rem:{" "}
                              {order.remaining_quantity ?? "—"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="quantity_fulfilled"
                control={allocateForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAllocateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLinkMutation.isPending}>
                  {createLinkMutation.isPending ? "Allocating..." : "Allocate"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={noteView.open}
        onOpenChange={(open) => setNoteView((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
          </DialogHeader>
          <div className="text-sm whitespace-pre-wrap wrap-break-word">
            {noteView.content || "No notes"}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setNoteView({ open: false, content: "" })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
