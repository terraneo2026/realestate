import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogClient from "./BlogClient";

export default function BlogPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full overflow-hidden">
        <BlogClient />
      </main>
      <Footer />
    </div>
  );
}
