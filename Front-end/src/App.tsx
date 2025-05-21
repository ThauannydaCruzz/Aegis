
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
<<<<<<< HEAD
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Chatbot from "./pages/Chatbot";
import SecurityDashboard from "./pages/SecurityDashboard";
=======
import Welcome from "./pages/Welcome";
import Chatbot from "./pages/Chatbot";
import SecurityDashboard from "./pages/SecurityDashboard";
import SecurityDetails from "./pages/SecurityDetails";
>>>>>>> b61f4638d4934fce659e8ebce08f9e0e46ba6d16
import ProfileEdit from "./pages/ProfileEdit";
import AegisTeam from "./pages/AegisTeam";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
<<<<<<< HEAD
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/security-dashboard" element={<SecurityDashboard />} />
=======
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/security-dashboard" element={<SecurityDashboard />} />
            <Route path="/security-details" element={<SecurityDetails />} />
>>>>>>> b61f4638d4934fce659e8ebce08f9e0e46ba6d16
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route path="/aegis-team" element={<AegisTeam />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> b61f4638d4934fce659e8ebce08f9e0e46ba6d16
