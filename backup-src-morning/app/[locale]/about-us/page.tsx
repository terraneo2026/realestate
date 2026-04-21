"use client";

import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primaryBg to-teal-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About eBroker</h1>
          <p className="text-lg opacity-90">Transforming Real Estate, One Property at a Time</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              eBroker was founded with a simple yet powerful vision: to revolutionize the real estate industry through technology and innovation. We believe that buying, selling, or renting a property should be transparent, efficient, and accessible to everyone.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Starting from humble beginnings, we've grown to become one of the most trusted real estate platforms in India. Our commitment to excellence and customer satisfaction has made us the preferred choice for thousands of property seekers, sellers, and investors.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, we continue to innovate and improve our services, leveraging cutting-edge technology to provide the best real estate experience possible.
            </p>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower individuals and families by providing a seamless, transparent, and trustworthy platform for all their real estate needs. We strive to simplify the property buying, selling, and renting process while maintaining the highest standards of integrity and professionalism.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading real estate platform globally, known for innovation, transparency, and customer-centricity. We envision a world where technology makes real estate accessible, fair, and rewarding for everyone involved in the transaction.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Transparency",
                  description: "We believe in honest communication and clear information every step of the way."
                },
                {
                  title: "Innovation",
                  description: "We constantly evolve our technology to better serve our customers' needs."
                },
                {
                  title: "Trust",
                  description: "Building lasting relationships based on reliability and integrity."
                },
                {
                  title: "Customer Focus",
                  description: "Your satisfaction and success are at the heart of everything we do."
                },
                {
                  title: "Excellence",
                  description: "We strive for the highest quality in all our services and interactions."
                },
                {
                  title: "Community",
                  description: "We're committed to contributing positively to the communities we serve."
                }
              ].map((value, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
                  <h4 className="text-xl font-bold text-primaryBg mb-3">{value.title}</h4>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Highlights */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Why Choose eBroker?</h2>
            <div className="space-y-4">
              {[
                "10,000+ verified properties across multiple cities",
                "Expert agents with years of industry experience",
                "Advanced search filters and property comparison tools",
                "Secure payment gateway with fraud protection",
                "24/7 customer support in multiple languages",
                "Free property valuation and market analysis",
                "Legal documentation assistance",
                "Virtual property tours and 360° views"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primaryBg text-white flex items-center justify-center mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primaryBg to-teal-600 text-white p-8 md:p-12 rounded-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
            <p className="text-lg opacity-90 mb-6">Start your journey with eBroker today and experience the future of real estate.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/en/properties" className="bg-white text-primaryBg font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
                Browse Properties
              </Link>
              <Link href="/en/contact" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
