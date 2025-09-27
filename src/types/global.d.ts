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

  business_category?: string;
  business_description?: string;
  company_city?: string;
  business_registration_location?: string;
  company_country?: string;
  company_state?: string;
  phone2?: string;
  postal_code?: string;
  is_registered_business: boolean;
}
export interface IndividualRegisterParams {
  first_name: string;
  last_name: string;
  address: string;
  residence_country: string;
  nationality: string;
  dob: string;
  phone2?: string;
  postal_code: string;
  identification_verifications: IdentificationVerification[];

  is_registered_business: boolean;
}

export interface IdentificationVerification {
  type: string;
  idType?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  dateOfIssue?: string;
  dateOfExpiry?: string;
  idNumber?: string; // ✅ added
}

export interface BuyerEditParams {
  first_name: string;
  phone: string;
  phone2: string;
  last_name: string;
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

export interface Review {
  id: string;
  rating: number;
  comment: string;
  country?: string; // optional
  user?: string; // optional, if you want user name
  date?: string; // optional
  verified?: boolean; // optional
}

export interface ImageData {
  id: string;
  image_urls: {
    original: string;
    medium: string;
    thumbnail: string;
  };
  alt_text?: string;
  product: string; // product id
}

export interface SpecificationData {
  id: string;
  name?: string;
  value?: string;
  product: string;
}

export interface Variations {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  stock?: number;
  low_stock_threshold?: number;
  low_stock_notified?: boolean;
  product: string; // product id
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  discount_percent?: number;
  sku?: string;
  category?: string; // e.g., gender or type
  inventory?: number;
  sold?: number;
  onSale?: boolean; // derived from discount_percent
  rating_average?: number;
  gender?: string;
  age_group?: string;
  variations_data?: Variation[]; // matches backend field
  images_data?: ImageData[]; // matches backend field
  specifications_data?: SpecificationData[]; // matches backend field
  whatsinbox?: string | null;
  origin?: string;
  is_active?: boolean;
  is_draft?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  manufacturer?: number;
  warehouse?: number | null;
  reviews_data?: Review[];
  image;
  variations?: Variation[];
  quantity: number;
  section?: string;
}

interface AddToCartParams {
  productId: string;
  quantity?: number;
  variationid: string | null;
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
  rawFile: File; // ✅ always required
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
  first_name: string;
  last_name: string;
  name: string;
  phone: string | null;
  phone2: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  landmark: string | null;
  zip_code: string | null;
  loyalty_points: number;
  preferred_payment_method: string | null;
  created_at: string;
};

export type BuyerData = {
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

export type BuyerItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
};

export type Address = {
  id: number;
  country: string;
  full_name: string;
  phone: string;
  state: string;
  city: string;
  postal_code: string;
  address: string;
  is_default: boolean;
};

export type BuyerSliceParams = {
  BuyerData: BuyerData;
  BuyerItems: BuyerItem[];
  BuyerAddresses: Address[];
};

// ✅ default object for BuyerData
export const buyerInitialData: BuyerData = {
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  account_status: "",
  date_created: "",
  date_joined: "",
  last_login: null,
  groups: [],
  is_accountant: false,
  is_active: false,
  is_agent: false,
  is_customer: false,
  is_google_user: false,
  is_manufacturer: false,
  is_staff: false,
  is_staff_member: false,
  is_superuser: false,
  profile_type: "",
  user_permissions: [],
  profile: {
    id: 0,
    profile_picture: null,
    first_name: "",
    last_name: "",
    name: "",
    phone: null,
    phone2: null,
    country: null,
    state: null,
    city: null,
    address: null,
    landmark: null,
    zip_code: null,
    loyalty_points: 0,
    preferred_payment_method: null,
    created_at: "",
  },
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
  profileId?: number; // manufacturer profile id
  email?: string;
  first_name?: string;
  phone?: string;
}

interface SellerVerification {
  percentage: number;
  isIncomplete: boolean;
  raw?: any; // keep full API response if needed
}

interface SellerState {
  data: SellerData;
  verificationStatus: SellerVerification | null;
}
