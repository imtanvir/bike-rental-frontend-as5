import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./pages/Footer";
import Navbar from "./pages/Navbar";
function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Outlet />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
