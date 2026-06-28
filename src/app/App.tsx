import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1b4d2e",
            color: "#fdf5e6",
            border: "1px solid rgba(253, 245, 230, 0.2)",
          },
        }}
      />
    </AuthProvider>
  );
}
