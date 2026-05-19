"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  ShoppingBag, 
  ShoppingCart, 
  Headset, 
  FileText, 
  UserSquare2,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  User
} from "lucide-react";
import { Input } from "@/components/ui/forms/Input";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  subItems?: { name: string; path: string }[];
}

type AdminRole = "Super Admin" | "Operational" | "IT" | "Support" | "Finance";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Users: false,
  });

  // Automatically detect the role based on the route path
  const getRoleFromPath = (path: string): AdminRole => {
    if (path.includes("/dashboard/admin/operational")) return "Operational";
    if (path.includes("/dashboard/admin/it")) return "IT";
    if (path.includes("/dashboard/admin/support-department")) return "Support";
    if (path.includes("/dashboard/admin/finance")) return "Finance";
    return "Super Admin";
  };

  const currentRole = getRoleFromPath(pathname);

  // Define sidebar navigation configuration for each role
  const roleNavigation: Record<AdminRole, string[]> = {
    "Super Admin": ["Overview", "Users", "Verifications", "Products", "Orders", "Support", "Reports", "Staff"],
    "Operational": ["Overview", "Users", "Verifications", "Products", "Orders"],
    "IT": ["Overview", "Support", "Staff"],
    "Support": ["Overview", "Users", "Support"],
    "Finance": ["Overview", "Orders", "Reports"]
  };

  const sidebarItems: SidebarItem[] = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
    { 
      name: "Users", 
      icon: Users,
      path: "/dashboard/admin/users",
      subItems: [
        { name: "Buyers", path: "/dashboard/admin/users?type=buyers" },
        { name: "Sellers", path: "/dashboard/admin/users?type=sellers" }
      ]
    },
    { name: "Verifications", icon: ShieldCheck, path: "/dashboard/admin/verifications" },
    { name: "Products", icon: ShoppingBag, path: "/dashboard/admin/products" },
    { name: "Orders", icon: ShoppingCart, path: "/dashboard/admin/orders" },
    { name: "Support", icon: Headset, path: "/dashboard/admin/support" },
    { name: "Reports", icon: FileText, path: "/dashboard/admin/reports" },
    { name: "Staff", icon: UserSquare2, path: "/dashboard/admin/staff" },
  ];

  // Filter sidebar items dynamically based on selected role
  const activeRoleItems = roleNavigation[currentRole] || [];
  const filteredSidebarItems = sidebarItems.filter(item => activeRoleItems.includes(item.name));

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isItemActive = (item: SidebarItem) => {
    if (item.name === "Overview") {
      // Check if it is exact /dashboard/admin or operational/it/finance/support-department index pages
      return pathname === "/dashboard/admin" || 
             pathname === "/dashboard/admin/operational" || 
             pathname === "/dashboard/admin/it" || 
             pathname === "/dashboard/admin/support-department" ||
             pathname === "/dashboard/admin/finance";
    }
    if (pathname.startsWith(item.path)) return true;
    if (item.subItems) {
      return item.subItems.some(sub => pathname.startsWith(sub.path));
    }
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-gray-700 py-6 px-4">
      {/* Menu Title Label exactly as shown in image 2 */}
      <p className="text-[11px] font-MontserratBold text-gray-800 uppercase tracking-widest pl-3.5 mb-5 mt-2">Menu</p>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-3 overflow-y-auto scrollbar-hide px-1">
        {filteredSidebarItems.map((item) => {
          const hasSubItems = !!item.subItems;
          const isExpanded = expandedItems[item.name];
          const active = isItemActive(item);

          return (
            <div key={item.name} className="space-y-1">
              {hasSubItems ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] transition-all text-[12px] font-MontserratSemiBold ${
                      active 
                        ? "bg-[#6A0DAD] text-white shadow-md shadow-[#6A0DAD]/15" 
                        : "text-gray-600 hover:bg-gray-50/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon className={`w-4.5 h-4.5 ${active ? "text-white" : "text-gray-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded || active ? "rotate-180" : ""}`} />
                  </button>

                  {/* Subitems */}
                  {(isExpanded || active) && (
                    <div className="pl-10 mt-1.5 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.subItems!.map((sub) => {
                        const isSubActive = pathname === "/dashboard/admin/users" 
                          ? (sub.path.includes("buyers") && !pathname.includes("sellers")) 
                          : pathname.startsWith(sub.path);
                          
                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className={`flex items-center px-4 py-2.5 rounded-lg text-[11px] font-MontserratMedium transition-all ${
                              isSubActive
                                ? "text-[#6A0DAD] font-MontserratBold"
                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50/50"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-[12px] transition-all text-[12px] font-MontserratSemiBold ${
                    active
                      ? "bg-[#6A0DAD] text-white shadow-md shadow-[#6A0DAD]/15"
                      : "text-gray-600 hover:bg-gray-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className={`w-4.5 h-4.5 ${active ? "text-white" : "text-gray-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 ${active ? "text-white" : "text-gray-400"}`} />
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8f9fa] w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 bg-white border-r border-[#eef0f3] z-30">
        {/* Brand / Logo exactly aligned with sidebar */}
        <div className="h-16 md:h-20 flex items-center px-8 border-b border-[#eef0f3]">
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <span className="text-xl font-MontserratBold text-[#6A0DAD] tracking-wider">MARTAF</span>
          </Link>
        </div>
        {sidebarContent}
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 bg-white border-b border-[#eef0f3] h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Hamburger menu */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Desktop Brand Label in Mobile header */}
            <span className="lg:hidden text-lg font-MontserratBold text-[#6A0DAD] tracking-wider">MARTAF</span>

            {/* Central Search Bar exactly matching second image */}
            <div className="hidden md:block w-full max-w-md ml-4">
              <Input 
                placeholder="Search for products" 
                icon={<Search className="w-4 h-4 text-gray-400 cursor-pointer" />} 
                className="h-11 border border-[#eef0f3] bg-[#f8f9fa] rounded-xl px-4 py-2 focus:bg-white transition-all text-xs"
              />
            </div>
          </div>

          {/* Right Header Actions exactly matching Image 2 */}
          <div className="flex items-center gap-4 md:gap-6 text-gray-600">
            {/* Notifications Bell */}
            <button className="relative hover:bg-gray-50 rounded-full transition-colors p-1">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">1</span>
            </button>

            {/* User Profile Outline Dropdown */}
            <div className="relative flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-500">
                <User className="w-4.5 h-4.5" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto bg-[#f8f9fa]">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside className={`
        lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Close Button Inside Mobile Drawer */}
        <button 
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-50 rounded-full text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="h-16 flex items-center px-6 border-b border-[#eef0f3]">
          <span className="text-xl font-MontserratBold text-[#6A0DAD] tracking-wider">MARTAF</span>
        </div>
        {sidebarContent}
      </aside>
    </div>
  );
}
