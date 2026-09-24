"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Car from "@/assets/Icons2/Car.png";
import { DropdownModalProps, Category } from "@/types/global";
import { RootState } from "@/store";
import { useLogout } from "@/utils/logout";
import LogoutConfirmModal from "@/components/ui/Modals/LogoutConfirmModal";
import { useHttp } from "@/hooks/use-http";

import CategorySkeleton from "@/components/reloadSpinner/CategorySkeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "../../Button/Button";

import Logo from "@/assets/Logos/authLogo.svg";
import CloseModal from "@/assets/headerIcon/closeModal.png";
import CaretDown from "@/assets/headerIcon/caretD.png";
import Currency from "@/assets/headerIcon/CurrencyCircleDollar.png";
import speak from "@/assets/headerIcon/speakIcon.png";
import shipto from "@/assets/headerIcon/shipto.png";
import English from "@/assets/headerIcon/englishicon.png";
import French from "@/assets/headerIcon/FrienchIcon.png";
import Spanish from "@/assets/headerIcon/spanish.png";
import Portegual from "@/assets/headerIcon/Portugal.png";

const settings = [
  {
    icon: Currency,
    name: "Currency",
    options: [
      { icon: English, name: "USD - $" },
      { icon: Spanish, name: "EUR - €" },
      { icon: Portegual, name: "NGN - ₦" },
    ],
  },
  {
    icon: speak,
    name: "Language",
    options: [
      { icon: English, name: "English" },
      { icon: Spanish, name: "Spanish" },
      { icon: French, name: "French" },
      { icon: Portegual, name: "Portuguese" },
    ],
  },
  {
    icon: shipto,
    name: "Ship To",
    options: [
      { icon: English, name: "United States" },
      { icon: Spanish, name: "Nigeria" },
      { icon: French, name: "United Kingdom" },
    ],
  },
];

const CATEGORIES_CACHE_KEY = "dropdown_modal_categories";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export default function DropdownModal({
  open,
  onClose,
  onOpenAuth,
}: DropdownModalProps & { onOpenAuth: (step: any) => void }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = useLogout(dispatch);

  const token = useSelector((state: RootState) => state.token.token);

  const { sendHttpRequest, loading } = useHttp();
  const isFetchingRef = useRef(false);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Per-category subcategory cache: slug -> { data, loading }
  const [subcategoryMap, setSubcategoryMap] = useState<
    Record<string, { data: any[]; loading: boolean }>
  >({});

  /* ------------------ Animations ------------------ */
  const modalVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const expandVariants: Variants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  /* ------------------ Fetch Categories ------------------ */
  const fetchCategories = (saveToCache = true) => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/categories/main/?page=${page}&page_size=20`,
        method: "GET",
      },
      successRes: (res: any) => {
        const newCategories: Category[] = res?.data?.results || [];
        const count = res?.data?.count || 0;

        setTotalCount(count);

        setCategories((prev) => {
          const merged = [...prev, ...newCategories];
          const unique = Array.from(
            new Map(merged.map((c) => [c.id, c])).values()
          );
          setHasMore(unique.length < count);

          if (saveToCache) {
            sessionStorage.setItem(
              CATEGORIES_CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                categories: unique,
                totalCount: count,
                hasMore: unique.length < count,
                page: page + 1,
              })
            );
          }

          return unique;
        });

        setPage((prev) => prev + 1);
        isFetchingRef.current = false;
      },
    });
  };

  /* ------------------ Fetch Subcategories On-Demand ------------------ */
  const fetchSubcategories = (cat: Category) => {
    const slug = cat.slug;

    // Already fetched or currently loading — skip
    if (subcategoryMap[slug]) return;

    // Mark as loading immediately
    setSubcategoryMap((prev) => ({
      ...prev,
      [slug]: { data: [], loading: true },
    }));

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/categories/subcategories/?parent=${encodeURIComponent(slug)}`,
        method: "GET",
      },
      successRes: (res: any) => {
        const subs: any[] =
          res?.data?.results ||
          res?.data?.subcategories ||
          (Array.isArray(res?.data) ? res.data : []) ||
          (Array.isArray(res) ? res : []);

        setSubcategoryMap((prev) => ({
          ...prev,
          [slug]: { data: subs, loading: false },
        }));
      },
    });
  };

  /* ------------------ Handle Category Click ------------------ */
  const handleCategoryClick = (cat: Category) => {
    const slug = cat.slug;
    const isCurrentlyOpen = openCategory === slug;

    if (isCurrentlyOpen) {
      setOpenCategory(null);
    } else {
      setOpenCategory(slug);
      fetchSubcategories(cat);
    }
  };

  /* ------------------ Initial Load / Cache ------------------ */
  useEffect(() => {
    if (!open) return;

    const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

      if (!isExpired) {
        setCategories(parsed.categories);
        setTotalCount(parsed.totalCount);
        setHasMore(parsed.hasMore);
        setPage(parsed.page);
        fetchCategories(false); // background refresh without overwriting cache
        return;
      } else {
        sessionStorage.removeItem(CATEGORIES_CACHE_KEY);
      }
    }

    // No cache or expired — fresh fetch
    setCategories([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    isFetchingRef.current = false;
    fetchCategories(true);
  }, [open]);

  /* ------------------ Scroll Pagination ------------------ */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      fetchCategories();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/10"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="absolute top-0 z-50 w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div
                className="bg-white w-full h-screen overflow-y-scroll touch-pan-y pb-30"
                onScroll={handleScroll}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center py-6 px-6 fixed w-full bg-white z-10">
                  <Link href="/">
                    <Image src={Logo} alt="Logo" width={39} height={32} />
                  </Link>
                  <button onClick={onClose}>
                    <Image src={CloseModal} alt="close" width={21} height={21} />
                  </button>
                </div>

                {/* Categories */}
                <div className="px-6 pt-24">
                  <h4 className="font-MontserratSemiBold text-c20 mb-6">
                    Categories
                  </h4>

                  {loading && categories.length === 0 ? (
                    <CategorySkeleton count={8} />
                  ) : categories.length === 0 ? (
                    <p className="text-gray-500 text-c12">
                      No categories available
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {categories.map((cat) => {
                        const slug = cat.slug;
                        const isOpen = openCategory === slug;
                        const subEntry = subcategoryMap[slug];
                        const subcategories = subEntry?.data || [];
                        const subLoading = subEntry?.loading ?? false;

                        return (
                          <li key={cat.id}>
                            {/* Category Row */}
                            <button
                              onClick={() => handleCategoryClick(cat)}
                              className="flex items-center justify-between w-full h-c48"
                            >
                              <span className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full justify-center flex items-center overflow-hidden">
                                  <Image
                                    src={cat.image || Car}
                                    alt={cat.name}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full"
                                  />
                                </div>
                                <span className="font-MontserratSemiBold text-c12">
                                  {cat.name}
                                </span>
                              </span>

                              <Image
                                src={CaretDown}
                                alt="open"
                                width={11}
                                height={6}
                                className={
                                  isOpen
                                    ? "rotate-180 transition-transform duration-200"
                                    : "transition-transform duration-200"
                                }
                              />
                            </button>

                            {/* Subcategory Panel */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  variants={expandVariants}
                                  initial="collapsed"
                                  animate="expanded"
                                  exit="collapsed"
                                  className="overflow-hidden"
                                >
                                  {subLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                      <LoadingSpinner
                                        color="border-ff715b"
                                        size={24}
                                      />
                                    </div>
                                  ) : subcategories.length === 0 ? (
                                    <p className="pl-c48 py-2 text-c12 text-gray-400 font-MontserratNormal">
                                      No subcategories available
                                    </p>
                                  ) : (
                                    <div className="flex flex-col pl-4 pb-3 pt-1">
                                      {subcategories.map((sub: any) => (
                                        <button
                                          key={sub.id || sub.slug}
                                          onClick={() => {
                                            router.push(
                                              `/categories/${encodeURIComponent(
                                                cat.slug
                                              )}/${encodeURIComponent(
                                                sub.slug || sub.id
                                              )}`
                                            );
                                            onClose();
                                          }}
                                          className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 hover:text-ff715b transition-colors duration-200 w-full"
                                        >
                                          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-e9eafd">
                                            {sub.image ? (
                                              <Image
                                                src={sub.image}
                                                alt={sub.name}
                                                width={28}
                                                height={28}
                                                className="h-7 w-7 rounded-full object-cover"
                                              />
                                            ) : (
                                              <Image
                                                src={Car}
                                                alt={sub.name}
                                                width={20}
                                                height={20}
                                                className="h-5 w-5 object-contain"
                                              />
                                            )}
                                          </div>
                                          <span className="text-c12 font-MontserratMedium text-161616 text-left">
                                            {sub.name}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {hasMore && (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner color="border-ff715b" size={20} />
                    </div>
                  )}
                </div>

                {/* Auth Buttons */}
                <div className="w-full fixed bottom-0 bg-ffffff">
                  <div className="flex gap-3 px-6 mt-c24 mb-c48">
                    {token ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            router.push("/dashboard/buyer");
                            onClose();
                          }}
                        >
                          Settings
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => setLogoutModalOpen(true)}
                        >
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => onOpenAuth("signin")}
                        >
                          Sign in
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => onOpenAuth("signup")}
                        >
                          Sign up
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onConfirm={() => {
          setLogoutModalOpen(false);
          logout();
          onClose();
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </>
  );
}
