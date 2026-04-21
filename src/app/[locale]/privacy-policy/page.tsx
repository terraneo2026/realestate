import { Navbar, Footer, PageHero } from "@/components/layout";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <PageHero 
          title="Privacy Policy" 
          description="Learn how we handle and protect your data"
          backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-8">
              We collect information you provide directly to us when you create an account, search for properties, or contact our support team.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-8">
              We use the information we collect to provide, maintain, and improve our services, and to communicate with you about property listings and updates.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="text-gray-600 mb-8">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at drrealty9@gmail.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
