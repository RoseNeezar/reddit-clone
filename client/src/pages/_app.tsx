import { AppProps } from "next/dist/next-server/lib/router/router";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { SWRConfig } from "swr";

import "../styles/globals.css";
import "../styles/icons.css";
import { AuthProvider } from "../context/auth";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
