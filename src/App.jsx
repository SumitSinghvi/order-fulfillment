import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Layout>
        <Dashboard />
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
