"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en';

  return (
    <footer className="bg-gray-900 text-gray-200 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                e
              </div>
              <h3 className="text-xl font-bold text-white">eBroker</h3>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted real estate partner for finding dream properties.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/properties`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#help" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <Link href={`/${locale}/privacy-policy`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@ebroker.com" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">
                <span className="font-semibold text-white">Email:</span><br />
                <a href="mailto:info@ebroker.com" className="hover:text-primary transition-colors">
                  info@ebroker.com
                </a>
              </li>
              <li className="text-sm text-gray-400">
                <span className="font-semibold text-white">Phone:</span><br />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 md:pt-12">
          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; 2024 eBroker. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export default Footer;