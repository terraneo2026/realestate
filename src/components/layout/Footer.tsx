"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "./Container";

const SocialLink = ({ icon: Icon, href }: { icon: any; href: string }) => (
  <Link
    href={href}
    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300"
  >
    <Icon size={20} />
  </Link>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block font-medium text-sm"
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const pathname = usePathname();
  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <footer className="bg-gray-950 text-gray-300 py-12 md:py-16 border-t border-white/5">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href={`/${locale}`} className="inline-block group">
              <div className="relative w-20 md:w-24 h-20 md:h-24 overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-105 shadow-md">
                <Image
                  src="/logo.jpeg"
                  alt="Relocate"
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 128px, 80px"
                  priority
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium text-gray-400">
              Relocate Biz is your premier destination for finding exceptional rental properties. We make leasing seamless.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Facebook} href="#" />
              <SocialLink icon={Twitter} href="#" />
              <SocialLink icon={Instagram} href="#" />
              <SocialLink icon={Linkedin} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold tracking-[0.2em] text-sm mb-8 opacity-50 uppercase">Company</h4>
            <ul className="space-y-4">
              <FooterLink href={`/${locale}/`}>Home</FooterLink>
              <FooterLink href={`/${locale}/properties`}>Browse Properties</FooterLink>
              <FooterLink href={`/${locale}/projects`}>Our Projects</FooterLink>
              <FooterLink href={`/${locale}/about-us`}>About Us</FooterLink>
              <FooterLink href={`/${locale}/contact`}>Contact Us</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold tracking-[0.2em] text-sm mb-8 opacity-50 uppercase">Services</h4>
            <ul className="space-y-4">
              <FooterLink href={`/${locale}/blog`}>Real Estate Blog</FooterLink>
              <FooterLink href={`/${locale}/favorites`}>My Favorites</FooterLink>
              <FooterLink href={`/${locale}/agent/login`}>Agent Login</FooterLink>
              <FooterLink href={`/${locale}/owner/login`}>Owner Login</FooterLink>
              <FooterLink href={`/${locale}/tenant/login`}>Tenant Login</FooterLink>
            </ul>
          </div>
 
          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold tracking-[0.2em] text-sm mb-8 opacity-50 uppercase">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium leading-relaxed">123 Business Avenue, Hyderabad, India</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <Mail size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">support@relocatebiz.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
          <p className="text-sm font-bold tracking-[0.1em] text-gray-600">
            © {new Date().getFullYear()} Relocate Biz. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-bold tracking-tight text-gray-600">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
export default Footer;
