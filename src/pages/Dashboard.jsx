import OrdersReceived from "./OrdersReceived";
import OrdersPlaced from "./OrdersPlaced";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <section id="orders-received" className="scroll-mt-24">
        <OrdersReceived />
      </section>
      <section id="orders-placed" className="scroll-mt-24">
        <OrdersPlaced />
      </section>
    </div>
  );
}

