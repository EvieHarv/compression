import GlobalStyles from "@/lib/GlobalStyles";
import StyledComponentsRegistry from "@/lib/registry";
import { Roboto_Mono } from "next/font/google";

// Mafs imports
import "mafs/core.css";
import "mafs/font.css";
import MafsStyle from "@/lib/MafsStyle";

const inter = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <MafsStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
