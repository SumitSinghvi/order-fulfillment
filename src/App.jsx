import { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(currentSession);
      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <Layout>
        <div className="flex justify-end pb-4">
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <p>Welcome to Order Management System</p>
          )}
        </div>

        {loading ? (
          <p>Loading session...</p>
        ) : session ? (
          <Dashboard />
        ) : (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Sign in required</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please sign in with Google to continue.
            </p>
            <div className="mt-4">
              <Button onClick={handleSignIn}>Sign in with Google</Button>
            </div>
          </div>
        )}
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
