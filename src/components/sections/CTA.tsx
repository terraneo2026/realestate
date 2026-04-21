'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

/**
 * CTA Section
 * Call-to-action banner to encourage user engagement
 */
export function CTASection() {
  return (
    <section className="bg-primary text-white py-12 md:py-16 lg:py-20 rounded-[3rem] mx-4 md:mx-8 mb-12">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
          Join thousands of satisfied customers who found their perfect home with us. Our expert team is here to help you every step of the way.
        </p>
        <Link href="/properties">
          <Button
            variant="white"
            size="lg"
            className="hover:scale-105"
          >
            Browse All Properties
          </Button>
        </Link>
      </Container>
    </section>
  );
}
