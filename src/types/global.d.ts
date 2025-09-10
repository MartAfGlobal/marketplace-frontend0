// import Button from "@/components/ui/Button/Button";
// import { title } from "process";

import { profile } from "console";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // if no href, render as plain text
}

export type LoadingSpinnerProps = {
  size?: number;
  color?: string;
};

type Category = {
  name: string;
  icon: string | StaticImageData;
  subcategories: string[];
};
type CategoryD = {
  name: string;
  subcategories: string | ReactNode;
};

type HttpRequestConfigType = {
  url: string;
  method: string;
  successMessage?: string;
  token?: string;
  params?: any;
  body?: any;
  isAuth?: boolean;
  userType?: "seller" | "buyer"; // 👈 added
};

export interface HttpRequestConfigProps {
  requestConfig: HttpRequestConfigType;
  successRes: (data: any) => void;
}

export interface Option {
  id: number;
  icon: React.ReactNode;
  label: string;
  component: React.ReactNode; // <-- add this
}

interface Question {
  id: number;
  question: string;
  answer: string;
}
interface OrderHistoryItem {
  title: string;
  icon: string | StaticImageData;
  total: string;
}

interface TrackOrders {
  id: string | number | null;
  date: string;
  title: string;
  discription: string;
  icon: string | StaticImageData;
  totalQuantity: string;
  colour: string;
  totalAmount: string;
}

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: {
    name: string;
    email: string;
    mobile: string;
    homeNumber: string;
  };
  onSave: (updatedDetails: {
    name: string;
    email: string;
    mobile: string;
    homeNumber: string;
  }) => void;
}

export type Passwords = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export interface RegisterParams {
  email: string;
  password: string;
  confirm_password: string;
  is_manufacturer?: boolean;
  phone?: string; // ✅ optional
}

export interface BusinessRegisterParams {
  company_name?: string;
  buisness_type?: string;
  business_registration_number?: string;
  business_category?: string;
  business_description?: string;
  city?: string;
  company_address?: string;
  residence_country?: string;
  state?: string;
  phone2?: string;
  postal_code?: string;
}

export interface BuyerEditParams {
  name: string;
  phone: string;
  phone2: string;
  email: string;
  name: string;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: Passwords) => void;
}

export interface ProfileImageProps {
  src: string | StaticImageData;
  alt?: string;
  onEditClick: () => void;
}

export type Address = {
  country: string;
  fullName: string;
  mobile: string;
  state: string;
  city: string;
  zip: string;
  street: string;
  defaultAddress: boolean;
};
export interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  currentAddress?: Partial<Address>; // optional for pre-filling form
}

export interface AtmCardProps {
  id: number;
  icon: string | StaticImageData;
  accountNo: string;
}

export interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: CardDetails) => void;
}

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  type: "toggle" | "check" | "button";
}

type ProfileImageModalProps = {
  isOpen: boolean;
  initialSrc: string;
  onClose: () => void;
  onUpload: (file: File) => void;
  onClear: () => void;
};

type CountryData = {
  code: string;
  name: string;
  flag: string | StaticImageData;
  language: string;
  currency: string;
};

type Section = {
  id: string;
  label: string;
  icon?: string | StaticImageData;
};

interface Props {
  sections: Section[];
  side?: "left" | "right";
  hideOnMobile?: boolean;
  onSectionClick: (id: string) => void;
}

interface FaqSectionProps {
  title: string;
  questions: Question[];
}

interface IconButtonCarouselProps {
  options: Option[];
}

interface AboutHeroProps {
  height?: string;
  bgImage: StaticImageData | string; // optional custom height class, default h-c601
  breadcrumbs: BreadcrumbItem[];
  smallTitle: string;
  mainTitle: string;
  description: string;
  paddingX?: string; // optional padding-x class, default px-c60
}

export interface Product {
  id: string;
  colour: string;
  title: string;
  slug: string;
  price: string;
  image: Array;
  section: string;
  category: string;
  onSale: boolean;
  rating: number;
  freeShipping: boolean;
  quantity?: number;
}


export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedSize: number;
  progress: number;
  uploaded: boolean;
  title: string;
  description: string;
  rawFile: File;   // ✅ always required
  url?: string;
}


export interface ProductPageProps {
  params: { slug: string }; // still declare type for TS
}

type RatingKey = 1 | 2 | 3 | 4 | 5;

interface ProductCardProps {
  product: Product;
}
export interface CategoryButtonProps {
  iconSrc: string | StaticImageData;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export interface AuthenticationLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export type TokenSliceParams = {
  token?: string | null;
};
interface ChooseCardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
}

export type AtmCardProps = {
  id: number;
  icon: string | StaticImageData;
  accountNo: string;
};
export type UserAddressProps = {
  id: number;
  name: string;
  icon: string | StaticImageData;
  phoneNo: string;
  address: string;
  className?: string;
};

export interface UsableCardProps {
  title: string;
  children: ReactNode;
}

interface NavigationBarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

type DropdownModalProps = {
  open: boolean;
  onClose: () => void;
};

export type Slide = {
  id: number;
  image: string;
  title: string;
  description: string;
  discount: string;
};

type Coupons = {
  id: string | number;
  title: string;
  discription: string;
};
type SellerDetails = {
  id: string | number;
  title: string;
  discription: string;
};
interface FooterComponent {
  title: string;
  children: ReactNode;
}
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onYes: () => void;
  onNo: () => void;
  yesText?: string;
  noText?: string;
  className?: string; // for extra styling
}

export interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

// types/global.ts (or wherever QuantitySelectorProps is defined)
export interface QuantitySelectorProps {
  productId: string | number;
  quantity: number;
  onChange?: (newQty: number, id: string | number) => void;

  // optional styling props
  increaseBg?: string;
  increaseText?: string;
  decreaseBorder?: string;
  decreaseText?: string;
  hoverDecreaseBg?: string;
  hoverDecreaseText?: string;
  buttonWidth?: string;
  buttonHeight?: string;
  quantityFont?: string;
}

interface SectionSelectorProps extends Props {
  onSectionClick: (id: string) => void;
  sections: { id: string; label: string; icon?: StaticImageData }[];
  hideOnMobile?: boolean;
}

type FilterModalProps = {
  onFiltersChange: (filters: any) => void;
  onClose: () => void; // <-- add this
};
types / global.d.ts;

// Define the Profile type first
export type BuyerProfile = {
  id: number;
  profile_picture: string | null;
  phone: string;
  phone2: string | null;
  country: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
};

export type Data = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_status: string;
  date_created: string;
  date_joined: string;
  last_login: string | null;
  groups: string[];
  is_accountant: boolean;
  is_active: boolean;
  is_agent: boolean;
  is_customer: boolean;
  is_google_user: boolean;
  is_manufacturer: boolean;
  is_staff: boolean;
  is_staff_member: boolean;
  is_superuser: boolean;
  profile_type: string;
  user_permissions: string[];
  profile: BuyerProfile;
};

// Your slice params type
export type BuyerSliceParams = {
  BuyerData: BuyerData;
  BuyerItems: BuyerItem[];
};

// Define the Profile type first
export type SellerProfile = {
  id: number;
  profile_picture: string | null;
  phone: string;
  phone2: string | null;
  country: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
};

// Define the main BuyerData type
export type Data = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_status: string;
  date_created: string;
  date_joined: string;
  last_login: string | null;
  groups: string[];
  is_accountant: boolean;
  is_active: boolean;
  is_agent: boolean;
  is_customer: boolean;
  is_google_user: boolean;
  is_manufacturer: boolean;
  is_staff: boolean;
  is_staff_member: boolean;
  is_superuser: boolean;
  profile_type: string;
  user_permissions: string[];
  profile: BuyerProfile;
};

// Your slice params type
export type BuyerSliceParams = {
  BuyerData: Data;
  BuyerItems: BuyerItem[];
};

export interface SellerProfile {
  CAC_No?: string | null;
  address?: string | null;
  bank_details?: string | null;
  bank_verification_status?: string | null;
  business_description?: string | null;
  business_industry?: string | null;
  business_license?: string | null;
  business_registration_location?: string | null;
  business_registration_number?: string | null;
  business_type?: string | null;
  city?: string | null;
  company_address?: string | null;
  company_logo_url?: string | null;
  company_name?: string | null;
  country?: string | null;
  created_at?: string | null;
  dob?: string | null;
  document_verification_status?: string | null;
  documents?: any[];
  email?: string | null;
  first_name?: string | null;
  id?: string | number;
  identification_verification?: string | null;
  is_fully_verified?: boolean;
  is_warehouse?: boolean;
  landmark?: string | null;
  last_name?: string | null;
  loyalty_points?: number;
  nationality?: string | null;
  phone?: string | null;
  phone2?: string | null;
  postal_code?: string | null;
  preferred_payment_method?: string | null;
  profile_picture_url?: string | null;
  residence_country?: string | null;
  state?: string | null;
  total_documents?: number;
  username?: string | null;
  verified_documents?: number;
  wallet_balance?: number;
  warehouse?: string | null;
  website?: string | null;
  account_status?: string;
  date_created?: string;
  date_joined?: string;
  is_accountant?: boolean;
  is_active?: boolean;
  is_agent?: boolean;
  is_customer?: boolean;
  is_google_user?: boolean;
  is_manufacturer?: boolean;
  is_staff?: boolean;
  is_staff_member?: boolean;
  is_superuser?: boolean;
  last_login?: string | null;
}

export interface SellerData {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  phone2?: string | null;
  profile?: SellerProfile;
}
