
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/Calendar.css";
import "~/styles/Spinner.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ShoppingCartProvider } from "~/components/CartContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ShoppingCartProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ShoppingCartProvider>

  )
};

export default api.withTRPC(MyApp);
