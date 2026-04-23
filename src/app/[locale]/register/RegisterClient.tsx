"use client";

import UnifiedRegisterForm from "@/components/auth/UnifiedRegisterForm";
import { useSearchParams } from "next/navigation";

interface RegisterClientProps {
  locale: string;
}

export default function RegisterClient({ locale }: RegisterClientProps) {
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role');
  
  // Valid roles: tenant, owner, agent
  const validRoles = ['tenant', 'owner', 'agent'];
  const initialRole = (roleParam && validRoles.includes(roleParam)) 
    ? (roleParam as 'tenant' | 'owner' | 'agent') 
    : 'tenant';

  return (
    <div className="w-full">
      <UnifiedRegisterForm initialRole={initialRole} locale={locale} />
    </div>
  );
}
