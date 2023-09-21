import GlobalStyles from "@/lib/GlobalStyles";
import StyledComponentsRegistry from "@/lib/registry";
import { Roboto_Mono } from "next/font/google";

const inter = Roboto_Mono({ subsets: ["latin"] });

// Mafs imports
import "mafs/core.css";
import "mafs/font.css";
import MafsStyle from "@/lib/MafsStyle";

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
