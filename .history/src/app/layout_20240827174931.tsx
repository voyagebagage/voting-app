import { Suspense, ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://telegram.org/js/telegram-widget.js"
          data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}
          data-size="large"
          data-onauth="onTelegramAuth(user)"
          data-request-access="write"
        />
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
