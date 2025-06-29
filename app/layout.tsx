// app/layout.tsx
import '../styles/globals.css';      // your global styles
import Navbar from '@/components/ui/navbar';
import { ToastProvider } from '@/components/hooks/use-toast';
import Footer from '@/components/ui/footer';

export const metadata = {
  title: 'NEXR Technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/nexr-white.png" />
      </head>
      <body>
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
        </ToastProvider>
        {/* <Footer/> */}
      </body>
    </html>
  );
}
