"use client";

import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-primary text-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 leading-tight">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-base md:text-lg text-white/90 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
          Join thousands of satisfied customers who found their perfect home with us. Our expert team is here to help you every step of the way.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/en/properties"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold text-base md:text-lg px-10 md:px-14 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
