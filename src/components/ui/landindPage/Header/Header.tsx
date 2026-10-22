"use client";

import Image from "next/image";
import Logo from "@/assets/images/logo.svg";
import handburger from "@/assets/headerIcon/mobileHandB.svg";
import Link from "next/link";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import NigeriaFlag from "@/assets/headerIcon/Nigeria.svg";
import DropIcon from "@/assets/headerIcon/CaretDown.svg";
import User from "@/assets/headerIcon/User.svg";

import LogOutIcon from "@/assets/headerIcon/logoutIcon.svg";
import HoverLogOutIcon from "@/assets/headerIcon/hoverlogoutIcon.svg";
import MyaccountIcon from "@/assets/headerIcon/myAcountIcon.svg";
import HoverMyaccountIcon from "@/assets/headerIcon/hovermyAcountIcon.svg";
import Cart from "@/assets/headerIcon/cart.svg";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import OtherSearchInput from "../../others/Search";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import DropdownModal from "../../mobile/modal/header-drop-modal";
import { useCallback, useEffect, useState } from "react";
import CartButton from "../../cart/cartButton";
import Gear from "@/assets/icons/Gear.svg";
import LogOut from "@/assets/icons/ArrowBendDownRight.svg";
import { closeMobileMenu, openMobileMenu } from "@/store/uiSlice";

import { useSearchParams } from "next/navigation";
import { useLogout } from "@/utils/logout";
import LogoutConfirmModal from "@/components/ui/Modals/LogoutConfirmModal";
import AuthModal from "../../mobile/auth/sign-up";
import { AuthStep } from "@/types/global";
import NotificationButton from "../../Button/notificationButton";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { useHttp } from "@/hooks/use-http";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const changeSearch = pathname?.startsWith("/others") ?? false;
  const searchParams = useSearchParams();
  const showLogin = searchParams.get("showLogin");
  const resetToken = searchParams.get("resetToken");
  const authUserType =
    searchParams.get("authUserType") === "seller" ? "seller" : "buyer";
  const authEmail = searchParams.get("email") || "";
  // const  {fetchLogs} = useFetchOrders()

  const token = useSelector((state: RootState) => state.token?.token);
  const buyer = useSelector((state: any) => state.buyer.BuyerData);
  const dispatch = useDispatch();
  const logout = useLogout(dispatch);
  const { sendHttpRequest, loading } = useHttp();

  const router = useRouter();

  // const [openDropdown, setOpenDropdown] = useState(false);

  const openDropdown = useSelector(
    (state: RootState) => state.ui.mobileMenuOpen,
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>();

  const [userOpen, setUserOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [accountHover, setAccountHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

  useEffect(() => {
    if (resetToken) {
      setAuthStep("resetPassword");
      setShowModal(true);
    } else if (showLogin === "true") {
      setAuthStep("signin");
      setShowModal(true);
    }
  }, [showLogin, resetToken]);

  //  const fetchLogs = useCallback(() => {
  //   console.log("fetching notification logs......");

  //   if (!token) return;

  //   sendHttpRequest({
  //     requestConfig: {
  //       url: "notifications/logs/?page=1076",
  //       method: "GET",
  //       token,
  //       isAuth: true,
  //       userType: "buyer",
  //     },
  //     successRes: (responseData: any) => {
  //       console.log("dispute logs", responseData.data);
  //     },
  //   });
  // }, [token, sendHttpRequest]);

  // useEffect(() => {
  //   fetchLogs();
  // }, [fetchLogs]);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [mounted, setMounted] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile info on mount / login if token exists
  useEffect(() => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/accounts/UserDetails/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res: any) => {
        const resData = res?.data;
        const user = resData?.buyerDetails || resData?.user || resData;
        if (!user) return;

        dispatch(
          buyerActions.updateBuyerData({
            id: user?.id ?? "",
            email: user?.email ?? "",
            first_name: user?.first_name ?? "",
            last_name: user?.last_name ?? "",
            account_status: user?.account_status ?? "",
            date_created: user?.date_created ?? "",
            date_joined: user?.date_joined ?? "",
            last_login: user?.last_login ?? null,
            groups: user?.groups ?? [],
            is_accountant: user?.is_accountant ?? false,
            is_active: user?.is_active ?? false,
            is_agent: user?.is_agent ?? false,
            is_customer: user?.is_customer ?? false,
            is_google_user: user?.is_google_user ?? false,
            is_manufacturer: user?.is_manufacturer ?? false,
            is_staff: user?.is_staff ?? false,
            is_staff_member: user?.is_staff_member ?? false,
            is_superuser: user?.is_superuser ?? false,
            profile_type: user?.profile_type ?? "",
            user_permissions: user?.user_permissions ?? [],
            profile: {
              id: user?.profile?.id ?? 0,
              profile_picture: user?.profile?.profile_picture ?? null,
              first_name: user?.profile?.first_name ?? "",
              last_name: user?.profile?.last_name ?? "",
              name: user?.profile?.name ?? "",
              phone: user?.profile?.phone ?? null,
              phone2: user?.profile?.phone2 ?? null,
              country: user?.profile?.country ?? null,
              state: user?.profile?.state ?? null,
              city: user?.profile?.city ?? null,
              address: user?.profile?.address ?? null,
              landmark: user?.profile?.landmark ?? null,
              zip_code: user?.profile?.zip_code ?? null,
              loyalty_points: user?.profile?.loyalty_points ?? 0,
              preferred_payment_method:
                user?.profile?.preferred_payment_method ?? null,
              created_at: user?.profile?.created_at ?? "",
            },
          }),
        );
      },
    });
  }, [token, dispatch, sendHttpRequest]);

  const getProfileImage = (userObj: any) => {
    const pic = userObj?.profile?.profile_picture || userObj?.profile_picture;
    if (!pic || typeof pic !== "string") return User;
    if (
      pic.startsWith("http://") ||
      pic.startsWith("https://") ||
      pic.startsWith("/")
    ) {
      return pic;
    }
    return User;
  };

  return (
    <div className="pb-20 h-fit">
      <div className="w-full fixed z-50 top-0 left-0 right-0">
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-6a0dad hidden h-20 px-8 justify-center lg:px-14 py-4 lg:flex gap-4 items-center lg:justify-between"
        >
          {/* logo area */}
          <Link href="/" className="flex items-center gap-3">
            <Image src={Logo} alt="Logo" width={40} height={32.59} />
            <h1 className="font-MontserratBold text-2xl text-ffffff">MARTAF</h1>
          </Link>

          {changeSearch ? (
            <OtherSearchInput />
          ) : (
            <SearchInput
              className=" md:max-w-80 xl:max-w-116"
              showDropdown={true}
            />
          )}
          <div className="flex gap-6 items-center">
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <h1 className="text-ffffff font-MontserratMedium text-[18px]">
                  EN
                </h1>
                <Image
                  src={NigeriaFlag}
                  alt="NigeriaFlag"
                  width={24}
                  height={24}
                />
              </div>

              <button>
                <Image src={DropIcon} alt="DropIcon" width={16.5} height={9} />
              </button>
            </div> */}

            <div className="flex gap-4 items-center">
              {token && <NotificationButton size={22} />}
              <CartButton />
            </div>
            {!token && (
              <button
                onClick={() => router.push("/auth/login")}
                className="text-ffffff font-MontserratNormal border border-ffffff rounded-c8 px-8 py-2 text-sm hover:bg-ffffff h-10 flex items-center justify-center hover:text-6a0dad transition-colors  "
              >
                Login
              </button>
            )}

            {token && (
              <button
                onClick={() => setUserOpen((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <Image src={User} alt="loging user" width={25} height={32} />
                  <span className="lg:text-base md:text-sm font-MontserratSemiBold hidden text-nowrap lg:flex  text-ffffff">
                    Hi,{" "}
                    {`${
                      buyer?.first_name
                        ? buyer.first_name.charAt(0).toUpperCase() +
                          buyer.first_name.slice(1)
                        : "User"
                    }`}
                  </span>
                  <Image
                    src={DropIcon}
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className={`w-4 h-4 ${userOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
              </button>
            )}
          </div>
        </motion.header>

        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-[#6A0DAD] lg:hidden h-[56px]  px-3 flex items-center justify-between"
        >
          <div className="flex gap-3 items-center">
            <button
              onClick={() => dispatch(openMobileMenu())}
              className="px-1 py-1.75"
            >
              <Image src={handburger} alt="categories" width={24} height={18} />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="Logo" width={27.04} height={22.03} />
              <h1 className="font-MontserratBold text-c16 text-ffffff">
                MARTAF
              </h1>
            </Link>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-fit h-fit relative">
              <CartButton size={18} />
            </div>

            {token ? (
              <button
                onClick={() => setUserOpen((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <Image src={User} alt="loging user" width={25} height={32} />
                  <span className="lg:text-base md:text-sm font-MontserratSemiBold hidden text-nowrap lg:flex  text-ffffff">
                    Hi,{" "}
                    {`${
                      buyer?.first_name
                        ? buyer.first_name.charAt(0).toUpperCase() +
                          buyer.first_name.slice(1)
                        : "User"
                    }`}
                  </span>
                  <Image
                    src={DropIcon}
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className={`w-4 h-4 ${userOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setUserOpen((prev) => !prev)}
                aria-label="Open account menu"
                aria-expanded={userOpen}
                className="flex items-center gap-2"
              >
                <Image src={User} alt="User" width={18} height={18} />
              </button>
            )}

            {/* <div className="flex items-center gap-1">
              <h1 className="text-ffffff font-MontserratMedium text-c14">EN</h1>
              <Image
                src={NigeriaFlag}
                alt="NigeriaFlag"
                width={18}
                height={18}
              />
            </div> */}
          </div>
        </motion.header>
        {/* <div className="w-full px-3.75">
        <div className="w-full px-3.75">
          <AuthModal
            open={showModal}
            onClose={() => setShowModal(false)}
            defaultStep={showLogin === "true" ? "signin" : "signup"} // 👈 auto decide
          />
        </div>
      </div> */}
        <AnimatePresence>
          {userOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 lg:right-12.75 w-40 top-16 py-3 font-MontserratNormal text-c12 rounded-c8 z-40 custom-shadow bg-white border  "
            >
              <ul className="  text-000000 flex flex-col gap-2.5">
                <li>
                  {token ? (
                    <Link
                      href="/dashboard/buyer"
                      onClick={() => setUserOpen(false)}
                      onMouseEnter={() => setAccountHover(true)}
                      onMouseLeave={() => setAccountHover(false)}
                      className={`gap-2.5 px-4 h-6 flex items-center  transition-colors hover:text-ff715b ${
                        accountHover ? "text-ff715b" : "text-000000/50"
                      }`}
                    >
                      <Image
                        src={accountHover ? HoverMyaccountIcon : MyaccountIcon}
                        alt="My account"
                        width={12}
                        height={12}
                      />
                      My account
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setUserOpen(false)}
                        className="hidden lg:block px-4 py-2 h-6"
                      >
                        Login
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserOpen(false);
                          setAuthStep("signin");
                          setAuthOpen(true);
                        }}
                        className="lg:hidden block px-4 py-2 h-6"
                      >
                        Login
                      </button>
                    </>
                  )}
                </li>
                <li>
                  {token ? (
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        setLogoutModalOpen(true);
                      }}
                      onMouseEnter={() => setLogoutHover(true)}
                      onMouseLeave={() => setLogoutHover(false)}
                      className={`gap-2.5 px-4 py-2 flex items-center w-full  transition-colors hover:text-ff715b ${
                        logoutHover ? "text-ff715b" : "text-000000/50"
                      }`}
                    >
                      <Image
                        src={logoutHover ? HoverLogOutIcon : LogOutIcon}
                        alt="Log out"
                        width={12}
                        height={12}
                      />
                      Log out
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/auth/register"
                        onClick={() => setUserOpen(false)}
                        className="hidden lg:block px-4 py-2 "
                      >
                        Sign Up
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserOpen(false);
                          setAuthStep("signup");
                          setAuthOpen(true);
                        }}
                        className="lg:hidden block px-4 py-2 "
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* mobile screen modals */}
        <div className="w-full">
          <DropdownModal
            open={openDropdown}
            onClose={() => dispatch(closeMobileMenu())}
            onOpenAuth={(step) => {
              setAuthStep(step);
              setAuthOpen(true);
              dispatch(closeMobileMenu());
            }}
          />

          <AuthModal
            open={authOpen || showModal}
            onClose={() => {
              setAuthOpen(false);
              setShowModal(false);
            }}
            userType={authUserType}
            initialEmail={authEmail}
            defaultStep={
              authStep ? authStep : showLogin === "true" ? "signin" : "signup"
            }
          />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onConfirm={() => {
          setLogoutModalOpen(false);
          logout();
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </div>
  );
}
