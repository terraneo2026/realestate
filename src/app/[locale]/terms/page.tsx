import { Navbar, Footer, PageHero } from "@/components/layout";

export default function TermsPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <PageHero 
          title="Terms of Service" 
          description="Guidelines for using our premium real estate platform"
          backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-8">
              By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Use of Service</h2>
            <p className="text-gray-600 mb-8">
              Our platform provides real estate listing and search services. You are responsible for any information you post and for ensuring its accuracy.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
            <p className="text-gray-600 mb-8">
              Users must not engage in any illegal activities or use the platform to harass or defraud others. We reserve the right to terminate accounts that violate these terms.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-600">
              Relocate is not responsible for any transactions between buyers, sellers, tenants, or agents. We provide the platform for communication only.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
