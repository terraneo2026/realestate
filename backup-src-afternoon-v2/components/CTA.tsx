"use client";

import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-primary text-white py-14 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
          Join thousands of satisfied customers who found their perfect home with us. Our expert team is here to help you every step of the way.
        </p>
        <Link href="/browse">
          <button className="inline-block bg-white hover:bg-gray-100 text-primary font-bold text-base md:text-lg px-8 md:px-12 py-3.5 md:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Browse All Properties
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CTA;