"use client"
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ShoppingCart, User, ChevronDown, X, Globe, DollarSign, Anchor, LogOut, Heart, Plane, Ticket, Store, CreditCard, Building, MessageCircle, Coins, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { SignUpPopup } from "@/components/martaf/AuthPopups/SignUpPopup";
import { SignInPopup } from "@/components/martaf/AuthPopups/SignInPopup";
import { VerifyEmailPopup } from "@/components/martaf/AuthPopups/VerifyEmailPopup";
import { CheckInboxPopup } from "@/components/martaf/AuthPopups/CheckInboxPopup";
import { ForgotPasswordPopup } from "@/components/martaf/AuthPopups/ForgotPasswordPopup";
import { ResetPasswordPopup } from "@/components/martaf/AuthPopups/ResetPasswordPopup";
import { PasswordUpdatedPopup } from "@/components/martaf/AuthPopups/PasswordUpdatedPopup";
import { AllDonePopup } from "@/components/martaf/AuthPopups/AllDonePopup";
import { useRouter } from "next/navigation";
import { apiService, Category } from "@/lib/api";
import { toast } from "sonner";

const countries = [
  { code: "NG", name: "Nigeria", flag: "https://flagcdn.com/ng.svg" },
  { code: "FR", name: "France", flag: "https://flagcdn.com/fr.svg" },
  { code: "US", name: "USA", flag: "https://flagcdn.com/us.svg" },
];

// Function to get category icon based on category name
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('electronic') || name.includes('phone') || name.includes('mobile') || name.includes('bluetooth')) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('textile') || name.includes('apparel') || name.includes('wear') || name.includes('fashion')) {
    return "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('footwear') || name.includes('shoes') || name.includes('leather')) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('agricultural') || name.includes('farm')) {
    return "https://images.unsplash.com/photo-1464663353573-9bb73a63c544?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('plastic') || name.includes('chair')) {
    return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('timber') || name.includes('wood')) {
    return "https://images.unsplash.com/photo-1500740516770-92bd004b996e?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('building') || name.includes('construction')) {
    return "https://images.unsplash.com/photo-1504074996022-09080787b6b3?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('ceramic') || name.includes('pottery')) {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('personal care') || name.includes('beauty') || name.includes('health')) {
    return "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80";
  }
  
  // Default fallback icon
  return "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80";
};

// Transform API categories to the format expected by the component
const transformCategory = (category: Category): { name: string; icon: string; sub: string[] } => {
  return {
    name: category.name,
    icon: getCategoryIcon(category.name),
    sub: category.children?.map(child => child.name) ?? [],
  };
};


const languages = [
  { name: "English", flag: "https://flagcdn.com/gb.svg" },
  { name: "French", flag: "https://flagcdn.com/fr.svg" },
  { name: "Spanish", flag: "https://flagcdn.com/es.svg" },
  { name: "Portuguese", flag: "https://flagcdn.com/pt.svg" },
];

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [selectedCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Categories state
  const [categories, setCategories] = useState<{ name: string; icon: string; sub: string[] }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  // Auth drawer state
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'signin'|'signup'|'verify'|'checkinbox'|'forgot'|'reset'|'updated'|'done'>("signin");
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const apiCategories = await apiService.getCategories();
        const transformedCategories = apiCategories.map(transformCategory);
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategoriesError('Failed to load categories');
        // Optionally show a toast error
        // toast.error('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Handlers for popup transitions
  const handleSignUpSuccess = () => setAuthStep("checkinbox"); // Go to check inbox after signup
  const handleSignInSuccess = () => setAuthOpen(false); // Close drawer after successful sign in
  const handleGoogleSignIn = () => setAuthStep("checkinbox");
  const handleSignInToSignUp = () => setAuthStep("signup");
  const handleSignUpToSignIn = () => setAuthStep("signin");
  const handleForgotPassword = () => setAuthStep("forgot");
  const handleVerifyBack = () => setAuthStep("signup");
  const handleCheckInboxBack = () => setAuthStep("signup");
  const handleForgotBack = () => setAuthStep("signin");
  const handleResetBack = () => setAuthStep("signin");
  const handlePasswordUpdatedBack = () => setAuthStep("signin");
  const handleAllDoneBack = () => setAuthOpen(false);

  // Logout handler with redirect
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="w-full bg-[#7C2AE8] text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Mobile: Hamburger for mobile */}
        <div className="lg:hidden flex items-center">
          <button aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
          <Drawer open={open} onOpenChange={setOpen} direction="left">
            <DrawerContent className="w-[90vw] max-w-xs p-0 h-screen">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <span className="flex items-center gap-2">
                    <span className="text-[#7C2AE8] font-bold text-2xl">M</span>
                    <span className="font-semibold text-xl text-black">MARTAF</span>
                  </span>
                  <button onClick={() => setOpen(false)}><X className="w-7 h-7 text-black" /></button>
                </div>
                <div className="overflow-y-auto flex-1 px-4 pb-4">
                  <div className="text-2xl font-semibold mt-4 mb-2 text-black">Categories</div>
                  
                  {/* Categories loading state */}
                  {categoriesLoading && (
                    <div className="flex flex-col gap-3 mb-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                          <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Categories error state */}
                  {categoriesError && (
                    <div className="mb-6 p-3 bg-red-50 rounded-lg">
                      <p className="text-red-600 text-sm">{categoriesError}</p>
                      <button 
                        className="text-red-700 text-sm underline mt-1"
                        onClick={() => {
                          setCategoriesError(null);
                          // Retry fetching categories
                          const fetchCategories = async () => {
                            try {
                              setCategoriesLoading(true);
                              const apiCategories = await apiService.getCategories();
                              const transformedCategories = apiCategories.map(transformCategory);
                              setCategories(transformedCategories);
                            } catch (error) {
                              setCategoriesError('Failed to load categories');
                            } finally {
                              setCategoriesLoading(false);
                            }
                          };
                          fetchCategories();
                        }}
                      >
                        Try again
                      </button>
                    </div>
                  )}
                  
                  {/* Categories content */}
                  {!categoriesLoading && !categoriesError && (
                    <div className="flex flex-col gap-3 mb-6">
                      {categories.length === 0 ? (
                        <div className="text-gray-500 text-sm">No categories available</div>
                      ) : (
                        categories.map((cat) => (
                          <div key={cat.name}>
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === cat.name ? null : cat.name)}>
                              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={cat.icon} alt={cat.name} width={36} height={36} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-medium text-base text-black flex-1">{cat.name}</span>
                              {cat.sub.length > 0 && <ChevronDown className={`w-5 h-5 text-black transition-transform ${expanded === cat.name ? 'rotate-180' : ''}`} />}
                            </div>
                            {cat.sub.length > 0 && expanded === cat.name && (
                              <div className="ml-12 mt-1 flex flex-col gap-1">
                                {cat.sub.map((sub) => (
                                  <div key={sub} className="text-black text-sm py-0.5">{sub}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  
                  <div className="text-xl font-semibold mb-2 text-black">Settings</div>
                  <div className="flex items-center gap-2 mb-4 text-black"><Coins className="w-5 h-5" /> Currency: Nigerian Naira (₦)</div>
                  <div className="text-xl font-semibold mb-2 text-black">Language</div>
                  <div className="flex flex-col gap-2 mb-4">
                    {languages.map((lang) => (
                      <div key={lang.name} className="flex items-center gap-2 text-black">
                        <Image src={lang.flag} alt={lang.name} width={24} height={24} className="rounded-full" />
                        <span>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-black"><Anchor className="w-5 h-5" /> Ship to</div>
                </div>
                <div className="flex gap-2 p-4 border-t">
                  {isAuthenticated ? (
                    <div className="flex-1 space-y-2">
                      <div className="text-sm font-medium text-black">{user?.email}</div>
                      <Button 
                        className="w-full bg-red-600 text-white hover:bg-red-700"
                        onClick={() => { setOpen(false); handleLogout(); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        className="flex-1 bg-white text-[#FF715B] border border-[#FF715B] hover:bg-[#FF715B] hover:text-white" 
                        variant="outline"
                        onClick={() => { setOpen(false); setAuthOpen(true); setAuthStep('signin'); }}
                      >
                        Sign in
                      </Button>
                      <Button 
                        className="flex-1 bg-[#FF715B] text-white hover:bg-[#ff4d2d]"
                        onClick={() => { setOpen(false); setAuthOpen(true); setAuthStep('signup'); }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        
        {/* Desktop: Logo */}
        <div className="hidden lg:flex items-center">
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-bold">M</span>
            <span className="font-semibold text-xl tracking-wide">MARTAF</span>
          </a>
        </div>
        
        {/* Mobile: Logo */}
        <div className="lg:hidden">
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-bold">M</span>
            <span className="font-semibold text-xl tracking-wide">MARTAF</span>
          </a>
        </div>
        
        {/* Desktop: Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        
        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cart && cart.total_items > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF715B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.total_items}
              </span>
            )}
          </Link>
          {/* Profile/User icon - shows dropdown if authenticated, auth drawer if not */}
          <div>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <User className="w-6 h-6 cursor-pointer" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="text-sm font-medium border-b mb-2 pb-2">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist" className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="flex items-center">
                      <Plane className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/coupons" className="flex items-center">
                      <Ticket className="w-4 h-4 mr-2" />
                      Coupons
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/sellers" className="flex items-center">
                      <Store className="w-4 h-4 mr-2" />
                      Sellers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/payment-methods" className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Cards
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/shipping-addresses" className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Addresses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 border-t mt-2 pt-2">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <User className="w-6 h-6 cursor-pointer" onClick={() => { setAuthOpen(true); setAuthStep('signin'); }} />
                {/* Auth flow popups */}
                {authStep === 'signin' && (
                  <SignInPopup
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onSignUp={handleSignInToSignUp}
                    onForgotPassword={handleForgotPassword}
                    onGoogleSignIn={handleGoogleSignIn}
                    onSuccess={handleSignInSuccess}
                  />
                )}
                {authStep === 'signup' && (
                  <SignUpPopup
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onSignIn={handleSignUpSuccess}
                    onGoogleSignIn={handleGoogleSignIn}
                    onSignInLink={handleSignUpToSignIn}
                  />
                )}
                {authStep === 'verify' && (
                  <VerifyEmailPopup
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onBack={handleVerifyBack}
                  />
                )}
                {authStep === 'checkinbox' && (
                  <CheckInboxPopup
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onBack={handleCheckInboxBack}
                  />
                )}
                {authStep === 'forgot' && (
                  <ForgotPasswordPopup
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onBack={handleForgotBack}
                  />
                )}
                {authStep === 'reset' && (
                  <ResetPasswordPopup 
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onBack={handleResetBack} 
                  />
                )}
                {authStep === 'updated' && (
                  <PasswordUpdatedPopup 
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onBack={handlePasswordUpdatedBack} 
                  />
                )}
                {authStep === 'done' && (
                  <AllDonePopup 
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    onBack={handleAllDoneBack} 
                  />
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base font-medium">NG</span>
            <Image src={selectedCountry.flag} alt="flag" width={24} height={24} className="rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 