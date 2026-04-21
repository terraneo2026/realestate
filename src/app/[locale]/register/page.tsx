import { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register - Relocate",
  description: "Create an account on Relocate to find properties, list your property, or manage your real estate business.",
};

interface RegisterPageProps {
  params: {
    locale: string;
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 transition-all duration-500">
        <RegisterClient locale={locale} />
      </div>
    </div>
  );
}
