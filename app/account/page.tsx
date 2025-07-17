"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Heart,
  Plane,
  Ticket,
  Store,
  CreditCard,
  Building,
  ChevronRight,
  LogOut,
  X,
  Eye,
  EyeOff,
  DollarSign,
  Package,
  ShieldCheck,
  CheckCheck,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import {
  Home,
  ShoppingBag,
  MapPin,
  Bell,
  Globe,
  Lock,
  Shield,
  FileText,
} from "lucide-react";
import { apiService } from "@/lib/api";

import { Order, User as AppUser, ShippingAddress } from "@/types/api";
import { useRouter } from "next/navigation";
import { ConfirmDeliveryModal } from "@/components/martaf/ConfirmDeliveryModal";
import WishlistPage from "./(auth)/wishlist/page";
import MoreToLove from "@/components/martaf/MoreToLove";
import CouponsAndSellers from "@/components/martaf/CouponsAndSellers";
import AccountPaymentAddress from "@/components/martaf/AccountPaymentAddress";
import DesktopSettings from "@/components/martaf/DesktopSettings";
import Footer from "@/components/martaf/Footer";
import { UpdatePersonalDetailsModal } from "@/components/martaf/UpdatePersonalDetailsModal";
import { UpdateProfilePictureModal } from "@/components/martaf/UploadProfilePictureModal";
import { UpdatePasswordModal } from "@/components/martaf/UpdatePasswordModal";
import { AddAddressModal } from "@/components/martaf/AddAddressModal";
import { AddCardModal } from "@/components/martaf/AddCardModal";
import { getStatusDisplay } from "@/lib/utils";

const AccountPage = () => {
  const { user, logout, isLoading } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [userDetails, setUserDetails] = useState<AppUser | null>(null);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState<
    number | string | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<
    Order["status"] | undefined
  >(undefined);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPersonalDetailsModal, setShowPersonalDetailsModal] =
    useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>(
    []
  );

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!user) return;
        const raw: AppUser = await apiService.getUserDetails();
        setUserDetails(raw); // Local state only
      } catch (err) {
        console.error("Failed to load user details:", err);
      }
    };

    if (!isLoading && user) {
      fetchUserDetails();
    }
  }, [user, isLoading]);

  const handleProfileUpdated = (updatedUser: AppUser) => {
    setUserDetails(updatedUser); // update local user state
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { results } = await apiService.getOrderHistory(selectedStatus);
        setDisplayedOrders(results); // store all orders once
      } catch (err) {
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, [selectedStatus]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const quickAccessItems = [
    {
      title: "Wishlist",
      icon: Heart,
      href: "/account/wishlist",
    },
    {
      title: "Orders",
      icon: Plane,
      href: "/account/orders",
    },
    {
      title: "Coupons",
      icon: Ticket,
      href: "/account/coupons",
      disabled: true,
    },
    {
      title: "Sellers",
      icon: Store,
      href: "/account/sellers",
    },
    {
      title: "Cards",
      icon: CreditCard,
      href: "/account/payment-methods",
    },
    {
      title: "Addresses",
      icon: Building,
      href: "/account/shipping-addresses",
    },
  ];

  const staticItems = [
    {
      title: "Privacy policy",
      href: "/account/privacy-policy",
    },
    {
      title: "Legal information",
      href: "/account/legal",
    },
  ];

  const orderStatuses = [
    {
      label: "Unpaid",
      icon: <DollarSign className="w-6 h-6" />,
      count: 1,
    },
    {
      label: "To be shipped",
      icon: <Package className="w-6 h-6" />,
      count: 2,
    },
    {
      label: "Shipped",
      icon: <ShieldCheck className="w-6 h-6" />,
      count: 12,
    },
    {
      label: "Awaiting review",
      icon: <CheckCheck className="w-6 h-6" />,
      count: 4,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    if (isUpdatingPassword) return;
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Here you would make the API call to change password
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Password updated successfully!");
      setIsChangePasswordOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    if (isUpdatingPassword) return;
    setIsChangePasswordOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  // api functions related to order section on desktop
  const handleViewOrderDetails = async (orderId: string | number) => {
    try {
      // Optional: Fetch the order (to validate or pre-load)
      //await apiService.getOrder(Number(orderId));

      // Navigate to the order details page
      router.push(`/order-details/${orderId}`);
    } catch (error: any) {
      toast.error(error.message || "Could not load order details");
    }
  };

  const handleConfirmDelivery = async (orderId: string | number | null) => {
    try {
      await apiService.MarkOrderDelivered(orderId); // Await the API call
      toast.success(`Delivery confirmed for order #${orderId}`);
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast.error(error.message || "Failed to confirm delivery");
    }
  };

  const handleTrackOrder = async (orderId: number | string) => {
    try {
      await apiService.trackOrder(orderId);
      router.push(`/track-order/${orderId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to retrieve tracking information");
    }
  };

  const handleCancelOrder = async (orderId: number | string) => {
    try {
      const cancelledOrder = await apiService.cancelOrder(orderId);
      toast.success(`Order #${orderId} has been cancelled successfully`);

      // Optionally update the local state to reflect change
      setDisplayedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === cancelledOrder.id ? cancelledOrder : order
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel the order");
    }
  };
  const refreshAddresses = async () => {
    const updated = await apiService.getShippingAddresses();
    setShippingAddresses(updated);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center w-[17%] justify-between px-4 py-4 md:mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="p-2 flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">
          Account
        </h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Desktop Layout - Starts from md screen size */}
      <div
        className="md:flex md:min-h-screen md:px-6 relative
      "
      >
        {/* Sidebar - Hidden on mobile, shown on md and up */}
        <div className="hidden md:block md:w-64 h-screen overflow-y-auto md:border md:border-gray-50 sticky shadow top-0 rounded-xl">
          <div className="px-6 py-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Account Overview
            </h1>

            <div className="space-y-1">
              <Link href="/account">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Home />
                  Overview
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <ShoppingBag />
                  Orders
                </Button>
              </Link>
              <Link href="/account/wishlist">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Heart />
                  Wishlist
                </Button>
              </Link>
              <Link href="/account/coupons">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Ticket />
                  Coupons
                </Button>
              </Link>
              <Link href="/account/sellers">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Store />
                  Sellers
                </Button>
              </Link>
              <Link href="/account/payment-methods">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <CreditCard />
                  Cards
                </Button>
              </Link>
              <Link href="/account/shipping-addresses">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <MapPin />
                  Addresses
                </Button>
              </Link>
            </div>

            <div className="mt-8 space-y-1">
              <Link href="/account/notifications">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Bell />
                  Notifications
                </Button>
              </Link>
              <Link href="/account/language">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Globe />
                  Language & Region
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start flex gap-4 text-md"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <Lock />
                Password & Security
              </Button>
              <Link href="/account/privacy-policy">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <Shield />
                  Privacy policy
                </Button>
              </Link>
              <Link href="/account/legal">
                <Button
                  variant="ghost"
                  className="w-full justify-start flex gap-4 text-md"
                >
                  <FileText />
                  Legal information
                </Button>
              </Link>
            </div>

            <div className="mt-8 md:hidden">
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Mobile User Profile Section - Hidden on md screens and up */}
          <div className="md:hidden px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full">
                  {userDetails?.profile.profile_picture ? (
                    <img
                      src={userDetails.profile.profile_picture}
                      alt="Profile"
                      className="rounded-full w-16 h-16"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-semibold rounded-full">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}

                  {/* Camera icon overlay */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <Camera className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <div>
                  {userDetails?.first_name ? (
                    <h2 className="text-lg font-semibold text-black">
                      {userDetails.first_name}
                    </h2>
                  ) : (
                    <h2 className="text-lg font-semibold text-black">
                      {user?.email?.split("@")[0] || "User"}
                    </h2>
                  )}
                  <p className="text-gray-600 text-sm">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full bg-orange-400 hover:bg-orange-500"
                asChild
              >
                <Link href="/account/edit">
                  <Edit className="w-4 h-4 text-white" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Desktop User Profile Section - Hidden on mobile */}
          <div className="hidden md:block px-8 py-6">
            <div className="flex justify-between">
              <div className="flex gap-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  <div className="relative w-24 h-24">
                    {userDetails?.profile.profile_picture ? (
                      <img
                        src={userDetails.profile.profile_picture}
                        alt="Profile"
                        className="rounded-full w-24 h-24"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-semibold rounded-full">
                        {user?.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}

                    {/* Camera icon overlay */}
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
                      onClick={() => setShowProfilePictureModal(true)}
                    >
                      <Camera className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-base font-semibold">
                    Personal details
                  </h3>
                  <div className="text-sm text-gray-600 flex gap-4 mb-3">
                    <span className="font-semibold w-32">Full Name:</span>
                    <span className="text-black">
                      {userDetails?.first_name} {userDetails?.last_name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex gap-4 mb-3">
                    <span className="font-semibold w-32">Email address:</span>
                    <span className="text-black">{userDetails?.email}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex gap-4 mb-3">
                    <span className="font-semibold w-32">Mobile number:</span>
                    <span className="text-black">
                      {userDetails?.profile.phone}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex gap-4 mb-3">
                    <span className="font-semibold w-32">Home number:</span>
                    <span className="text-black">
                      {userDetails?.profile.phone2}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="text-orange-400"
                  onClick={() => setShowPersonalDetailsModal(true)}
                >
                  Edit details
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Quick Access Grid - Hidden on md screens and up */}
          <div className="md:hidden px-6 pb-6">
            <div className="grid grid-cols-3 gap-4">
              {quickAccessItems.map((item) =>
                item.disabled ? (
                  <Card
                    key={item.title}
                    className="p-4 h-24 border cursor-pointer hover:bg-gray-50 transition-colors opacity-60"
                    onClick={() => toast.info("Coming soon!")}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                      <item.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium text-center">
                        {item.title}
                      </span>
                    </div>
                  </Card>
                ) : (
                  <Link key={item.title} href={item.href}>
                    <Card className="p-4 h-24 border cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <item.icon className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium text-center">
                          {item.title}
                        </span>
                      </div>
                    </Card>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* confirm delivery modal */}
          <ConfirmDeliveryModal
            open={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedOrderId(null);
            }}
            onConfirm={handleConfirmDelivery}
            orderId={selectedOrderId ?? ""}
          />

          <UpdatePersonalDetailsModal
            open={showPersonalDetailsModal}
            onClose={() => setShowPersonalDetailsModal(false)}
            onProfileUpdated={handleProfileUpdated}
            initialValues={{
              first_name: userDetails?.first_name || "",
              last_name: userDetails?.last_name || "",
              phone: userDetails?.profile?.phone || "",
              phone2: userDetails?.profile?.phone2 || "",
            }}
          />

          <UpdateProfilePictureModal
            open={showProfilePictureModal}
            onClose={() => setShowProfilePictureModal(false)}
            onProfileUpdated={handleProfileUpdated}
            initialProfilePicture={userDetails?.profile?.profile_picture}
          />

          <UpdatePasswordModal
            open={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onSubmit={handleChangePassword}
          />

          <AddAddressModal
            open={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            onSubmit={async (form) => {
              await apiService.createShippingAddress(form);
              await refreshAddresses();
              setIsAddressModalOpen(false);
            }}
          />

          <AddCardModal
            open={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)}
            onSubmit={(form) => {
              console.log("Card submitted:", form);
              // Send to API...
            }}
          />

          {/* Desktop Content Area */}
          <div className="md:px-10 md:py-6">
            <h2 className="hidden md:block text-xl font-semibold mb-6">
              Orders
            </h2>
            {/* Orders Section - Desktop */}
            <div className="md:flex gap-12 w-[80%] hidden ">
              {orderStatuses.map((status) => (
                <Card
                  key={status.label}
                  className="relative aspect-square max-h-40 w-full text-center border border-red-100 p-4 flex flex-col justify-center items-center cursor-pointer"
                >
                  {/* Red badge count */}
                  <div className="absolute -top-2 -right-2 bg-[#FF5A5F] text-white text-xs font-semibold w-10 h-10 rounded-full flex items-center justify-center">
                    {status.count}
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-black">{status.icon}</div>
                    <span className="text-sm font-medium text-black">
                      {status.label}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
            <div className="hidden md:block my-6 ">
              <div className="flex items-center justify-between mb-4 ">
                <h3 className="text-md font-semibold text-gray-600">
                  Latest orders
                </h3>
                <Link
                  href="/account/orders"
                  className="text-orange-500 hover:text-orange-600"
                >
                  View all
                </Link>
              </div>

              {/* Sample Order Cards */}
              <div className="space-y-4 transition-all duration-300 ease-in-out">
                {displayedOrders?.map((order, index) => {
                  const statusDisplay = getStatusDisplay(order.status);
                  return (
                    <Card
                      key={order.id}
                      className="p-4 bg-white shadow-sm border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-0.5"
                      onClick={() => handleViewOrderDetails(order.id)}
                    >
                      {/* Status and Delivery - Better Alignment */}
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className={`text-sm font-medium ${statusDisplay.color} leading-tight`}
                        >
                          {statusDisplay.text}
                        </span>
                        <span className="text-xs text-gray-500 text-right leading-tight ml-2">
                          Delivery: {order.estimated_delivery_date ?? "Pending"}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              order.items?.[0]?.product?.images_data?.[0]
                                ?.image || "/placeholder.png"
                            }
                            alt={
                              order.items[0]?.product?.name || "Product image"
                            }
                            width={80}
                            height={80}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          {/* Product Info - Improved Spacing */}
                          <div className="md:flex justify-between">
                            <div>
                              <div className="space-y-1 mb-4">
                                <h3 className="font-semibold text-black text-sm sm:text-base leading-tight line-clamp-2">
                                  {order.items[0]?.product?.name}
                                </h3>
                                <p className="text-sm text-gray-600 leading-tight">
                                  {order.items[0]?.product?.description}
                                </p>
                                <p className="text-xs text-gray-500 leading-tight">
                                  {[
                                    order.items[0]?.variant?.color,
                                    order.items[0]?.variant?.size,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>

                              {/* Price */}
                              <p className="text-lg font-bold text-black mb-4">
                                ₦{order.items[0]?.price_at_purchase}
                              </p>
                            </div>

                            {/* Action Buttons - Responsive Layout */}
                            {order.status === "Out for Delivery" && (
                              <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                                <Button
                                  size="sm"
                                  className="hidden md:flex h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    setShowConfirmModal(true);
                                  }}
                                >
                                  Confirm delivery
                                </Button>
                                <Link
                                  href="/track-order"
                                  className="flex-1 md:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                                  >
                                    Track order
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  className="flex-1 md:hidden h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    setShowConfirmModal(true);
                                  }}
                                >
                                  Confirm delivery
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hidden md:flex w-full h-9 text-xs sm:text-sm text-orange-600 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                                  onClick={() =>
                                    handleViewOrderDetails(order.id)
                                  }
                                >
                                  Order details
                                </Button>
                              </div>
                            )}
                            {order.status === "Awaiting Confirmation" && (
                              <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                                <Link
                                  href="/account/edit/"
                                  className="flex-1 md:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                                  >
                                    Edit Address
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  className="flex-1 md:py-2 h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                                  //onClick={() => handleConfirmDelivery(order.id)}
                                >
                                  Confirm & Pay
                                </Button>
                              </div>
                            )}
                            {order.status === "Processing" && (
                              <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                                <Button
                                  size="sm"
                                  className="flex-1 h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancel order
                                </Button>
                                <Link
                                  href="/account/edit/"
                                  className="flex-1 md:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d]  font-medium transition-colors duration-200 md:px-24"
                                  >
                                    Edit Address
                                  </Button>
                                </Link>
                              </div>
                            )}
                            {order.status === "Shipped" && (
                              <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                                <Link
                                  href="/track-order"
                                  className="flex-1 md:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d]  font-medium transition-colors duration-200 md:px-24"
                                    onClick={() => handleTrackOrder(order.id)}
                                  >
                                    Track order
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  className="flex-1 h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    setShowConfirmModal(true);
                                  }}
                                >
                                  Confirm delivery
                                </Button>
                              </div>
                            )}
                            {order.status === "Delivered" && (
                              <div className="flex gap-2 sm:gap-3 md:flex-col md:pt-8">
                                <Button
                                  size="sm"
                                  className="flex-1 md:flex-none h-9 text-xs sm:text-sm border border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                                  onClick={() =>
                                    handleConfirmDelivery(order.id)
                                  }
                                >
                                  Add to cart
                                </Button>
                                <Link
                                  href="/track-order"
                                  className="flex-1 md:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d]  font-medium transition-colors duration-200 md:px-24"
                                  >
                                    Leave a review
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hidden md:flex w-full h-9 text-xs sm:text-sm text-orange-600 hover:bg-orange-100 font-medium transition-colors duration-200 md:px-24"
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* empty order state */}
              {displayedOrders.length === 0 && (
                <div className="text-center py-12 animate-fadeIn">
                  <p className="text-gray-500">No order made yet</p>
                </div>
              )}
            </div>
            {/* whishlist desktop only */}
            <div className="hidden md:block">
              <div className="flex justify-between mb-6">
                <p className="text-xl font-semibold">Wishlist</p>
                <Link
                  href="/account/wishlist"
                  className="text-orange-500 hover:text-orange-600 text-md"
                >
                  View all
                </Link>
              </div>
              <MoreToLove />
            </div>
            <div className="hidden md:block">
              <CouponsAndSellers />
            </div>
            <div className="hidden md:block">
              <AccountPaymentAddress
                setIsAddressModalOpen={setIsAddressModalOpen}
                setIsCardModalOpen={setIsCardModalOpen}
              />
            </div>
            <div className="hidden md:block mt-6">
              <DesktopSettings setIsChangePasswordOpen={setShowPasswordModal} />
            </div>

            {/* Mobile Settings Menu - Hidden on md screens and up */}
            <div className="md:hidden px-6 space-y-1">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="notification-settings"
                  className="border-b border-gray-100"
                >
                  <AccordionTrigger className="py-4 text-black font-medium hover:no-underline">
                    Notification settings
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Order notification
                        </span>
                        <Switch
                          defaultChecked
                          className="data-[state=checked]:bg-[#FF715B]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Promotions
                        </span>
                        <Switch
                          defaultChecked
                          className="data-[state=checked]:bg-[#FF715B]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Messages</span>
                        <Switch className="data-[state=checked]:bg-[#FF715B]" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="language-region"
                  className="border-b border-gray-100"
                >
                  <AccordionTrigger className="py-4 text-black font-medium hover:no-underline">
                    Language & Region
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Shipping to
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Nigeria</span>
                          <Image
                            src="https://flagcdn.com/ng.svg"
                            alt="Nigeria"
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-sm object-cover flex-shrink-0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Currency</span>
                        <span className="text-sm">NGN (₦)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Language</span>
                        <span className="text-sm">English</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="password-security"
                  className="border-b border-gray-100"
                >
                  <AccordionTrigger className="py-4 text-black font-medium hover:no-underline">
                    Password & Security
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Change password
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-500 hover:text-orange-600 p-0 h-auto font-normal"
                          onClick={() => setIsChangePasswordOpen(true)}
                        >
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Enable two-factor authentication
                        </span>
                        <Switch className="data-[state=checked]:bg-[#FF715B]" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {staticItems.map((item) => (
                <Link key={item.title} href={item.href}>
                  <div className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-black font-medium">{item.title}</span>
                  </div>
                </Link>
              ))}

              <Link href="/account/delete">
                <div className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors">
                  <span className="text-red-600 font-medium">
                    Delete account
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile Logout Button - Hidden on md screens and up */}
            <div className="md:hidden px-6 py-8">
              <Button
                variant="outline"
                className="w-full max-w-sm mx-auto block border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Drawer */}
      <Drawer
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DrawerContent className="md:w-[60%] md:mx-auto">
          <DrawerHeader className="flex flex-row items-center justify-between space-y-0 pb-4 ">
            <DrawerTitle className="text-xl font-semibold">
              Change password
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                disabled={isUpdatingPassword}
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-gray-700"
              >
                Current password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("currentPassword", e.target.value)
                  }
                  className="pr-10"
                  disabled={isUpdatingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("current")}
                  disabled={isUpdatingPassword}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("newPassword", e.target.value)
                  }
                  className="pr-10"
                  disabled={isUpdatingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("new")}
                  disabled={isUpdatingPassword}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("confirmPassword", e.target.value)
                  }
                  className="pr-10"
                  disabled={isUpdatingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("confirm")}
                  disabled={isUpdatingPassword}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12 border-[#FF715B] text-[#FF715B] hover:bg-red-50"
                onClick={handleCancelPasswordChange}
                disabled={isUpdatingPassword}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-[#FF715B] text-white hover:bg-[#ff4d2d] disabled:opacity-50"
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "Updating..." : "Update password"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;
