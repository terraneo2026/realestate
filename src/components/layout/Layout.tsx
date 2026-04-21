'use client';

import { Navbar } from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
