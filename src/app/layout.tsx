import "./globals.css";
import { AppProviders } from "@/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="bg-blue-900">
          <AppProviders>{children}</AppProviders>
        </main>
      </body>
    </html>
  );
}
