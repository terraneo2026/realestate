"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "../AuthModal";
import { auth, firestore } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('userProfile');
    window.location.href = `/${locale}`;
  };

  return (
    <header>
      {/* Top Bar - Minimal Contact Info */}
      <div className="hidden md:block bg-primaryBg text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="mailto:drrealty9@gmail.com" className="flex items-center gap-1 hover:opacity-80 transition">
                <span>📧</span>
                drrealty9@gmail.com
              </a>
              <a href="tel:8125384888" className="flex items-center gap-1 hover:opacity-80 transition">
                <span>📱</span>
                8125384888
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 z-10 flex-shrink-0">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primaryBg rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
                R
              </div>
              <span className="text-lg md:text-2xl font-bold primaryColor hidden sm:inline">Relocate</span>
            </Link>

            {/* Location Selector - Hidden on Tablet and below */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg flex-shrink-0">
              <span className="text-lg">📍</span>
              <div>
                <label className="text-xs text-gray-600 block">Location</label>
                <select className="bg-transparent border-0 font-semibold text-gray-800 text-xs focus:outline-none">
                  <option>Chennai</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                </select>
              </div>
            </div>

            {/* Navigation - Visible on Tablet and above */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0 flex-wrap">
              <Link href={`/${locale}`} className="text-gray-700 hover:primaryColor transition font-medium text-xs md:text-sm">
                Home
              </Link>
              <Link href={`/${locale}/properties`} className="text-gray-700 hover:primaryColor transition font-medium text-xs md:text-sm">
                Properties
              </Link>
              <Link href={`/${locale}/projects`} className="text-gray-700 hover:primaryColor transition font-medium text-xs md:text-sm">
                Projects
              </Link>
              <Link href={`/${locale}/about-us`} className="text-gray-700 hover:primaryColor transition font-medium text-xs md:text-sm">
                About Us
              </Link>
              <Link href={`/${locale}/blog`} className="text-gray-700 hover:primaryColor transition font-medium text-xs md:text-sm">
                Blog
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-700 hover:primaryColor transition font-medium text-xs md:text-sm">
                Contact
              </Link>
            </nav>

            {/* Login/Register or Profile Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href={`/${locale}/${userProfile?.role || 'tenant'}/dashboard`}
                  className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition text-sm"
                >
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">
                    {userProfile?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition text-sm font-bold uppercase tracking-widest text-[10px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-3 md:px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-xs md:text-sm flex-shrink-0 whitespace-nowrap"
              >
                <span>👤</span>
                <span className="hidden lg:inline">Login/Register</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 text-2xl flex-shrink-0 p-2"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pb-3 border-t pt-3 flex flex-col gap-2 bg-gray-50 -mx-3 px-3 py-2 rounded-b-lg">
              <Link href={`/${locale}`} className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm">
                Home
              </Link>
              <Link href={`/${locale}/properties`} className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm">
                Properties
              </Link>
              <Link href={`/${locale}/projects`} className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm">
                Projects
              </Link>
              <Link href={`/${locale}/about-us`} className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm">
                About Us
              </Link>
              <Link href={`/${locale}/blog`} className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm">
                Blog
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm">
                Contact
              </Link>
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:primaryColor transition py-1 px-2 rounded hover:bg-gray-100 text-sm font-semibold text-left"
              >
                Login/Register
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
