import Link from "next/link";
import { ShieldOff } from "lucide-react";

// Shown in place of a section the signed-in staff member has no access to, e.g. when
// they type its URL directly. The API refuses the same requests regardless.
export default function NoAccess() {
  return (
    <div className="bg-white rounded-2xl p-10 border border-000000/4 flex flex-col items-center text-center gap-3 animate-in fade-in duration-300">
      <div className="w-12 h-12 rounded-full bg-[#CA0202]/10 text-[#CA0202] flex items-center justify-center">
        <ShieldOff className="w-6 h-6" />
      </div>
      <h1 className="text-c18 font-MontserratSemiBold">You don&apos;t have access to this section</h1>
      <p className="text-c12 text-000000/44 font-MontserratNormal max-w-sm">
        Your role doesn&apos;t include this area. If you think that&apos;s a mistake, ask an administrator to update your role.
      </p>
      <Link href="/dashboard/admin" className="mt-2 text-c12 font-MontserratMedium text-[#ff715b] hover:underline">
        Back to overview
      </Link>
    </div>
  );
}
