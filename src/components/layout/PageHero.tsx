'use client';

import { Container } from './Container';

interface PageHeroProps {
  title: string;
  description?: string;
  gradientFrom?: string;
  gradientTo?: string;
  backgroundImage?: string;
}

export function PageHero({ 
  title, 
  description, 
  gradientFrom = 'from-primary/90', 
  gradientTo = 'to-teal-600/90',
  backgroundImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'
}: PageHeroProps) {
  return (
    <div className="relative text-white py-12 md:py-16 lg:py-20 overflow-hidden min-h-[350px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} mix-blend-multiply opacity-90`}></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-1">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>
      
      <Container className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight animate-fade-in drop-shadow-lg">
          {title}
        </h1>
        {description && (
          <p className="text-base md:text-lg lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in delay-100 drop-shadow-md">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
