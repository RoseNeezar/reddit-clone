import { AppProps } from "next/dist/next-server/lib/router/router";
import axios from "axios";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
