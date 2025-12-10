import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFulfillmentLinks,
  useCreateFulfillmentLink,
  useDeleteFulfillmentLink,
  useOrdersReceived,
  useOrdersPlaced,
} from "@/hooks/useOrders";
import { fulfillmentLinkSchema } from "@/schemas/orderSchemas";
import { Button } from "@/components/ui/button";
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
  order_received_id: "",
  order_placed_id: "",
  quantity_fulfilled: 1,
};

export default function Fulfillment() {
  const { data, isLoading, error } = useFulfillmentLinks();
  const { data: receivedOrders } = useOrdersReceived();
  const { data: placedOrders } = useOrdersPlaced();
  const createMutation = useCreateFulfillmentLink();
  const deleteMutation = useDeleteFulfillmentLink();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(fulfillmentLinkSchema),
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Fulfillment Links</CardTitle>
              <CardDescription>
                Connect received orders to placed orders with fulfilled quantity.
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Create link</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create fulfillment link</DialogTitle>
                  <DialogDescription>
                    Allocate supplier quantities to customer orders.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    className="grid gap-4 md:grid-cols-3"
                    onSubmit={onSubmit}
                  >
                    <FormField
                      name="order_received_id"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Received</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select order received" />
                              </SelectTrigger>
                              <SelectContent>
                                {receivedOrders?.map((order) => (
                                  <SelectItem key={order.id} value={order.id}>
                                    {order.item_name} — {order.customer_name}
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
                      name="order_placed_id"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Placed</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select order placed" />
                              </SelectTrigger>
                              <SelectContent>
                                {placedOrders?.map((order) => (
                                  <SelectItem key={order.id} value={order.id}>
                                    {order.item_name} — {order.party_name}
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
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity Fulfilled</FormLabel>
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
                    <DialogFooter className="md:col-span-3 gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Linking..." : "Create Link"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Use the “Create link” button to allocate supplier quantities.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Links</CardTitle>
          <CardDescription>Data from `order_fulfillment_links`.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading links...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error.message}</p>
          ) : data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Received</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      {link.orders_received?.item_name ??
                        link.order_received_id}
                    </TableCell>
                    <TableCell>
                      {link.orders_placed?.item_name ??
                        link.order_placed_id}
                    </TableCell>
                    <TableCell>{link.quantity_fulfilled}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(link.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600">No links yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

