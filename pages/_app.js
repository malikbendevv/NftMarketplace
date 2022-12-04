import Script from "next/script";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";
import { Navbar, Footer } from "../components";

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider attribute="class">
    <div className="dark:bg-nft-dark bg-white min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
    <Script
      src="https://kit.fontawesome.com/f06fe16dad.js"
      crossorigin="anonymous"
    />
  </ThemeProvider>
);

export default MyApp;
