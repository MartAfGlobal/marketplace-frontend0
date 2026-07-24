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
  userType?: "seller" | "buyer" | "admin"; // 👈 added
};

export interface HttpRequestConfigProps {
  requestConfig: HttpRequestConfigType;
  successRes: (data: any) => void;
  errorRes?: (err: any) => void;
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
  total: number;
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
  email?: string;
  password: string;
  confirm_password: string;
  is_manufacturer?: boolean;
  phone?: string; // ✅ optional
}
export interface VerifyParams {
  email: string;
}

export interface BusinessRegisterParams {
  company_name?: string;
  buisness_type?: string;
  business_industry?: string;
  business_registration_number?: string;
  CAC_No?: string;
  shipping_zone?: string;
  CAC_No_file?: File | null;
  tax_identification_number?: string;
  tax_identification_file?: File | null;
  certificate_of_registration?: File | null;
  vat_number?: string;
  is_registered_business?: boolean;
}
export type IdEntry = {
  means_of_id: string;
  id_number: string;
  id_front_image?: File | null;
  id_back_image?: File | null;
};

export interface IndividualRegisterParams {
  fullname: string;

  vat_number: string;
  tax_identification_number: string;

  tax_identification_file?: File | null;

  ids: IdEntry[];
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
export interface ResetParams {
  newPassword: string;
  comfirmPassword: string;
}

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: Passwords) => void;
}

export interface ProfileImageProps {
  src: string | StaticImageData | null;
  alt?: string;
  onEditClick: () => void;
}

export interface AddressModalProps {
  id?: string | null;
  isEdit: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (address: Address) => void;
  currentAddress?: Partial<Address>; // optional for pre-filling form
}
export interface CheckOutModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedItems?: any[];
  isEditing?: boolean;
  currentAddress?: Partial<GuestCheckoutAddress>; // optional for pre-filling form
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
  id:
    | "email_enabled"
    | "push_enabled"
    | "order_updates_email"
    | "security_email"
    | "promotions_email"
    | "support_email"
    | "features_email"
    | "order_updates_push"
    | "security_push"
    | "promotions_push"
    | "support_push"
    | "features_push";
  title: string;
  description: string;
  type: "toggle";
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
export interface Category {
  id: string;
  image: string | null;
  name: string;
  slug: string;
  parent_name: string;
  subcategory: subcategory;
  children: subcategory[];
}

export interface subcategory {
  id: string;
  image: string | null;
  name: string;
  slug: string;
  parent_name: string;
}

export interface PriceRange {
  min: string;
  max: string;
  currency: string;
}
export interface ProductImage {
  id: string;
  alt_text: string;
  thumbnail: string;
  medium: string;
  large: string;
  cloudinary_id?: string;
  url?: string;
}
export interface AvailableAttribute {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}
export interface VariationOption {
  attribute_id: string;
  attribute_name: string;
  display_order: number;

  extra_fields: ExtraField[];
  values: VariationValue[];
}
export interface ExtraField {
  name: string;
  label: string;
  default?: string;
}
export interface VariationValue {
  id: string;
  value: string;
  slug: string;

  extra_data: Record<string, string>;

  display_order: number;

  min_price: string;
  max_price: string;

  available_variations_count: number;
  has_stock: boolean;
}
export interface ProductVariation {
  id: string;
  sku: string;
  name: string;

  attribute_summary: Record<string, string>;
  // Example: { Size: "Large", Weight: "25kg" }

  base_price: number;
  final_price: string;

  has_discount: boolean;
  stock: number;
  is_default: boolean;

  images: ProductImage[];

  main_image_url: string;
}
export interface Feature {
  id: string;
  name: string;
  value: string;
}
export interface Specification {
  id: string;
  title: string;
  text: string;
  image: string | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  whatsinbox: string;
  brand: string;
  category: Category;
  manufacturer_name: string;
  created_at: string;
  is_active: boolean;
  is_published: boolean;
  is_draft: boolean;

  inventory: number;
  sold: number;

  base_price: number;
  price_range: PriceRange;
  rating_average: number;
  main_image: string;
  images: ProductImage[];

  has_variations: boolean;
  variation_count: number;

  available_attributes: AvailableAttribute[];
  variation_options: Record<string, VariationOption>;
  variations: ProductVariation[];

  features: Feature[];
  specifications: Specification[];
}

export interface SpecificationData {
  id: string;
  name?: string;
  value?: string;
  product: string;
}

export interface ColorPreview {
  hex_code: string;
  id: string;
  value: gray;
}

export interface Product {
  base_price: string;
  brand: string;
  category: Category;
  color_preview: ColorPreview[];
  has_variations: boolean;
  id: string;
  inventory: number;
  is_active: boolean;
  main_image: {
    medium: string;
    thumbnail: string;
  };
  created_at: string;
  manufacturer_name: string;
  name: string;
  price_range: PriceRange;
  rating_average: number;
  slug: string;
  sold: number;
  variation_count: number;
}
export interface Manufacturer {
  id: number;
  company_name: string;
  company_address?: string | null;
  company_city?: string | null;
  company_country?: string | null;
  company_state?: string | null;
  company_logo_url?: string | null;
  business_description?: string | null;
  business_industry?: string | null;
  business_registration_location?: string | null;
  business_type?: string | null;
  bank_verification_status?: string | null;
  email?: string | null;
  phone?: string | null;
  phone2?: string | null;
  website?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;
  address?: string | null;
}
export interface OrderProduct {
  discription: string;
  id: string;
  images: [];
}
export interface OrderItem {
  seller_name?: string;
  can_cancel?: boolean;
  id: string;
  items_count: number;
  checkout: string;
  order_no: string;
  created_at: string;
  updated_at: string;
  status: string; // "To Ship"
  payment_status: string; // "Paid"
  subtotal: number;
  tax: number;

  shipping_cost: number;
  total_price: number;

  discount_amount: number;
  escrow: string | null;
  coupon: string | null;

  shipping_info: ShippingInfo;
  shipping_address: string;

  tracking_number: string | null;
  estimated_delivery_date: string | null;
  return_reason: string | null;

  manufacturer: string | null;
  user: string;

  order_items: OrderLineItem[];
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}
export interface OrderShippingAddress {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}
export interface BuyerDispute {
  id: string;
  dispute_number: string;

  product_image: string;

  dispute_type: string;
  dispute_type_display: string;

  status: string;
  status_display: string;

  buyer_name: string;
  seller_name: string;

  order_number: string;
  order_item_id: string;

  product_id: string;
  product_name: string;

  variant_id: string;
  variant_name: string;

  return_method: string;
  return_method_display: string | null;

  cancellation_reason_title: string;

  requested_refund_amount: number;
  approved_refund_amount: number | null;

  created_at: string; // ISO date
  resolved_at: string | null;
}

export interface DisputePayload {
  id: string;
  dispute_number: string;
  dispute_type: "RETURN" | string;
  dispute_type_display: string;

  status: string;
  status_display: string;
  new_status: string;
  old_status: string;

  is_active: boolean;
  is_pending: boolean;

  created_at: string;
  updated_at: string;

  buyer_name: string;
  buyer_email: string;
  seller_name: string;

  order_number: string;
  order_item_id: string;

  product_id: string;
  product_name: string;
  product_image: string;

  variant_id: string;
  variant_name: string;

  item_price: number;
  item_quantity: number;
  affected_quantity: number;

  requested_refund_amount: number;
  approved_refund_amount: number | null;

  resolution_type: string | null;
  resolution_type_display: string | null;

  return_method: "DROP_OFF" | "PICK_UP" | string;
  return_method_display: string;

  return_tracking_number: string | null;
  return_received_at_hub: string | null;

  inspection_passed: boolean | null;
  inspection_notes: string;

  admin_notes: string;
  additional_info: string;

  can_be_cancelled_by_buyer: boolean;
  can_raise_dispute: boolean;
  can_be_resolved: boolean;

  cancellation_reason_title: string;
  cancellation_reason_description: string;
  rejection_reason: string | null;

  assigned_to_name: string | null;
  resolved_by_name: string | null;
  resolved_at: string | null;
  reviewed_at: string | null;

  evidence: EvidenceItem[];
  timeline: TimelineItem[];
}
export interface EvidenceItem {
  id: string;
  file: string;
  file_url: string;
  file_type: "IMAGE" | "VIDEO" | string;
  caption: string;
  uploaded_at: string;
}

export interface TimelineItem {
  id: string;
  action: string;
  actor_name: string;
  actor_type: "BUYER" | "SELLER" | "ADMIN" | string;
  created_at: string;

  notes: string;
  metadata: {
    cancellation_reason_code?: string;
    return_method?: string;
  };
}

export interface Items {
  id: string;
  product: Product;
  total_price: string;
  quantity: number;
  price_at_purchase: number;
  total_price: string;
  variation?: {
    id: string;
    age_group: string;
    base_price: number;
    final_price: number;
    main_image: {
      image_urls: {
        medium: string;
        original: string;
        thumbnail: string;
      };
    };
    gender: string;
    sku: string;
    size?: string | null;

    name: string | null;
    stock?: number;
  } | null;
}

export interface OrderLineItem {
  id: string;

  has_dispute: boolean;
  product: string;
  product_name: string;
  product_image: string;
  product_sku: string;
  product_slug: string;
  category_name: string;
  category_slug: string;
  can_raise_dispute: boolean;

  quantity: number;
  fulfilled_quantity: number;

  price_at_purchase: number;
  total_price: string;

  can_cancel?: boolean;
  cancellation_reason: string | null;

  refundable_amount: string;
  shipping_share: number;

  status: string;
  seller_order_status: string;

  manufacturer_id: string;
  manufacturer_name: string;
  manufacturer_email: string;

  variation: string | null;
  variation_name: string;
  variation_sku: string;

  attributes: {
    [key: string]: {
      id?: string;
      name?: string;
      value?: string;
    };
  };

  weight_kg: number;
}

export interface Variation {
  id: string;
  name: string;
  sku: string;
  age_group: string;
  gender: string;
  base_price: number;
  final_price: number;
  stock?: number;
  main_image?: {
    image_urls: {
      original: string;
      medium: string;
      thumbnail: string;
    };
  };
}

export interface GuestShippingAddress {
  city: string | null;
  line1: string | null;
  line2: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
}

export interface OrderDetails {
  id: string;
  order_no: string;
  checkout: string;
  user: string;
  payment_reference: string;
  payment_status: string;
  status: string;
  coupon: string | null;
  discount_amount: number;
  subtotal: number;
  total_price: number;
  tax: number;
  shipping_cost: number;
  shipping_method: string | null;
  shipping_address: string | null;
  tracking_number: string | null;
  estimated_delivery_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  wallet_paid: boolean;
  manufacturer?: string | Manufacturer | null;
  guest_shipping_address?: GuestShippingAddress | null;
  items: OrderItem[];
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
  rawFile: File;
  url?: string;
}

export interface ProductPageProps {
  params: { slug: string };
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
  userType: "seller" | "buyer" | "admin";
  stage?: 1 | 2 | 3;
  className?: string;
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
  success?: boolean;
  loading?: boolean;
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

interface OrderDetailsPageProps {
  params: { id: string };
  searchParams: { mode?: string };
}

// types/global.ts (or wherever QuantitySelectorProps is defined)
export interface QuantitySelectorProps {
  productId?: string | number;
  quantity: number;
  main_value?: string;
  onChange: (newQty: number, id?: string | number) => void;

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
  id: string;
  country_name?: string;
  country: string;
  first_name: string;
  last_name: string;
  phone: string;
  state: string;
  city: string;
  postal_code: string;
  address: string;
  shipping_location: string;
  is_default: boolean;
};
export type OrderAddress = {
  fullname?: string;
  id: string | null;
  country: string;
  first_name: string;
  last_name: string;
  phone: string;
  state: string;
  city: string;
  postal_code: string;
  address: string;
  is_default: boolean;
};
export type GuestCheckoutAddress = {
  shipping_location_id?: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_shipping_address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };

  discount_amount: string;
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



interface SellerVerification {
  percentage: number;
  isIncomplete: boolean;
  raw?: any; // keep full API response if needed
}

interface SellerState {
  data: SellerData;
  verificationStatus: SellerVerification | null;
}
export interface MobileLoginProps {
  onClose: () => void;
  setStep: React.Dispatch<React.SetStateAction<AuthStep>>;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
}

export type AuthStep =
  | "signup"
  | "signin"
  | "forgot"
  | "resetVerify"
  | "resetPassword"
  | "verificationSent"
  | "personalDetails";

export interface ShippingInfo {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface OrderItem {
  image: string;
  manufacturer: string;
  name: string;
  product_id: string;
  quantity: number;
  total_price: number;
  unit_price: number;
}

export interface SingleOrder {
  created_at: string;
  items: OrderItem[];
  order_id: string;
  payment_status: string;
  shipping: number;
  shipping_info: ShippingInfo;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
}

export interface OrderData {
  checkout_id: string;
  orders: SingleOrder[];
}

export interface OrderState {
  orderData: OrderData | null;
}
export interface ShippingInfo {
  fullname: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface SuccessOrderItem {
  product_id: string;
  name: string;
  slug: string;
  image: string;
  manufacturer: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SuccessOrder {
  order_id: string;
  status: string; // "To Ship"
  payment_status: string; // "Paid"
  created_at: string;

  items_count: number;
  items: SuccessOrderItem[];

  subtotal: number;
  tax: number;
  shipping: number;
  total: number;

  shipping_info: ShippingInfo;
}

export interface SuccessOrderData {
  checkout_id: string;
  order: SuccessOrder;
}

export interface SuccessOrderState {
  SuccessOrderData: SuccessOrderData | null;
}

// export interface ProductListResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Product[];
// }
export interface PriceRange {
  min: string;
  max: string;
  currency: string;
}
export interface sellerProduct {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  inventory: number;
  manufacturer_name: string;

  is_active: boolean;
  is_draft: boolean;
  is_published: boolean;
  is_approved: "approved" | "pending" | "rejected";

  created_at: string;

  brand: string | null;

  main_image: {
    medium: string;
    thumbnail: string;
  };

  has_bulk_pricing: boolean;
  has_variations: boolean;
  variation_count: number;

  sold: number;
  rating_average: number;

  price_range: PriceRange;

  category: Category;

  sales_percentag: number;
  subcategory: SubCategory;
  stockcode: string;

  color_preview: ColorPreview[];

  bulk_price_threshold: number;
  bulk_price_tiers: BulkPriceTier[];

  variation_options: Record<string, VariationOption>;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface sellerImage {
  id: string;
  alt_text: string;
  thumbnail: string;
  medium: string;
  large: string;
}
export interface SellerProductDetails {
  id: string;
  name: string;
  slug: string;
  stockcode: string;
  first_image?: string;
  activation_requested: boolean;
  deactivation_requested: boolean;

  can_edit: boolean;

  description: string;
  description_html: string;

  specifications: any[];
  specifications_html: string;
  specifications_text: string;

  features: any[];
  category_info?: {
    category: {
      id: string;
      name: string;
    };
    subcategory: {
      id: string;
      name: string;
    };
  };
  draft_data?: {
    product_images: sellerImage[];
    specifications: any[];
    specifications_text: string;
    variations: ProductVariation[];
  };

  available_attributes: ProductAttribute[];

  variation_options: VariationOptions;
  variations: ProductVariation[];
  variation_count: number;

  has_variations: boolean;
  has_bulk_pricing: boolean;

  bulk_price_threshold: number;
  bulk_price_tiers: any[];

  base_price: number;
  price_range: PriceRange;

  inventory: number;
  sold: number;
  sales_percentage: number;

  rating_average: number;

  brand: string | null;
  manufacturer_name: string;

  main_image: {
    medium: string;
    thumbnail: string;
  };
  images: sellerImage[];

  is_active: boolean;
  is_approved: "approved" | "pending" | "rejected" | "pending_update";
  is_published: boolean;

  created_at: string;

  category?: ProductCategory;
  weight: number;
  whatsinbox: string | null;
  whatsinbox_html: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  name: string;
  slug: string;
  image: string | null;
  subcategory: SellersubCategory;
}

export interface SellersubCategory {
  id: string;
  name: string;
  slug: string;
  name: string;
  slug: string;
  image: string | null;
}
export interface ProductDraftPayload {
  id: string;
  name: string;
  base_price: number;
  quantity: number;
  category: string;
  first_image: string;
  created_at: string;
  updated_at: string;
  last_edited_at: string;
  time_since_edit: string;

  category_info: {
    category: {
      id: string;
      name: string;
    };
    subcategory: {
      id: string;
      name: string;
    };
  };

  draft_summary: {
    completeness_percent: number;
    feature_count: number;
    has_category: boolean;
    has_description: boolean;
    has_images: boolean;
    has_name: boolean;
    has_price: boolean;
    spec_count: number;
    variation_count: number;
  };
}
export type RequestType = {
  requestType: "activation" | "deactivation" | "submit" | null;
};

export interface OrderVariationAttribute {
  slug: string;
  value: string;
  extra_data?: any;
}

export interface OrderItemAttributes {
  Size?: OrderVariationAttribute;
  Color?: OrderVariationAttribute;
  Material?: OrderVariationAttribute;
  [key: string]: OrderVariationAttribute | undefined;
}

export interface SellerOrderItemPayload {
  attributes: OrderItemAttributes;
  can_cancel: boolean;
  can_raise_dispute: boolean;
  cancellation_reason: string | null;
  category_name: string;
  category_slug: string;
  fulfilled_quantity: number;
  has_dispute: boolean;
  id: string;
  manufacturer_email: string;
  manufacturer_id: string;
  manufacturer_name: string;
  price_at_purchase: number;
  product: string;
  product_image: string;
  product_name: string;
  product_sku: string;
  product_slug: string;
  quantity: number;
  refundable_amount: string;
  seller_order_status: string;
  shipping_share: number;
  status: string;
  total_price: string;
  variation: string;
  variation_name: string;
  variation_sku: string;
  weight_kg: number;
  accepted_quantity?: number;
  rejected_quantity?: number;
}

export interface SellerOrderResult {
  acceptance_deadline: string;
  accepted_at: string | null;
  can_accept: boolean;
  commission_fee: number;
  created_at: string;
  fulfilled_at: string | null;
  fulfillment_deadline: string | null;
  hub_delivery_status: string;
  id: string;
  is_acceptance_deadline_passed: boolean;
  is_fulfillment_deadline_passed: boolean;
  items: SellerOrderItemPayload[];
  parcel_id: string | null;
  payment: string;
  payout_status: string;
  received_at_hub_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  seller: number;
  seller_earnings: number;
  seller_name: string;
  shipping_cost: number;
  shipping_address?: OrderShippingAddress;
  status: string;
  subtotal: number;
  accepted_quantity: number;
  rejected_quantity: number;
  time_remaining_to_accept: number;
  time_remaining_to_fulfill: number | null;
  updated_at: string;
}

export interface AdminBuyerData {
  account_status: "Active" | "Inactive" | "Suspended";
  city: string | null;
  country: string | null;
  created_at: string;
  date_joined: string;
  disputes: number;
  email: string;
  email_verified: boolean;
  first_name: string | null;
  id: number;
  is_active: boolean;
  last_name: string | null;
  loyalty_points: boolean;
  phone: string;
  state: string | null;
  total_orders: number;
  user_id: string;
}
export interface BuyerAddress {
  id: string;
  user: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string;
  address: string;
  full_address?: string;
  city: string;
  state: string;
  country: string;
  country_code?: string;
  country_name?: string;
  postal_code: string;
  is_default?: boolean;
  shipping_location?: string;
  shipping_location_name?: string;
  shipping_zone_id?: string;
  created_at?: string;
  updated_at?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AdminBuyerDetailsData {
  account_status: "Active" | "Inactive" | "Suspended" | string;
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
  date_joined: string;
  deleted_at: string | null;
  deletion_reason: string | null;
  disputes: number;
  dob: string | null;
  email: string;
  email_verified: boolean;
  first_name: string | null;
  gender: string | null;
  gender_display: string | null;
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  is_google_user: boolean;
  landmark: string | null;
  last_login: string | null;
  last_name: string | null;
  loyalty_points: number;
  phone: string;
  phone2: string | null;
  last_payment_method: string | null;
  preferred_payment_method: string | null;
  postal_code: string | null;
  state: string | null;
  suspended_at: string | null;
  suspension_note: string;
  return_rat: number;
  max_order_amount: string | null;
  profile_picture_url: string | null;
  suspension_reason: string | null;
  suspension_reason_display: string | null;
  total_orders: number;
  last_login_ip: string | null;
  last_order_date: string | null;
  user_id: string;
  addresses?: BuyerAddress[];
  default_address?: BuyerAddress | null;
}

export interface AdminSellerData {
  bank_verification_status: "VERIFIED" | "UNVERIFIED" | "PENDING";
  business_industry: string | null;
  company_country_name: string;
  company_name: string;
  created_at: string;
  id: 9;
  is_registered_business: false;
  location: string;
  phone: string;
  profile_picture_url: string | null;
  seller_ref: string;
  shipping_zone: string | null;
  total_orders: number;
  total_products: number;
  user_email: string;
  user_id: string;
  kyc_status: "VERIFIED" | "REJECTED" | "PENDING";
  user_is_active: boolean;
  user_status: "Pending" | "Verified" | "Active" | "Rejected" | "Suspended";
  wallet_balance: number;
}

export interface VerificationSteps {
  identification_verified: boolean;
  personal_info: boolean;
  phone_verified: boolean;
}

export interface VerificationProgress {
  completed_steps: number;
  percentage: number;
  steps: VerificationSteps;
  total_steps: number;
}

export interface SellerAddress {
  id: number;
  address_type: "SHIPPING" | "RETURN" | string;
  same_as_business_address: boolean;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  updated_at: string;
}

export interface AdminSellerDetailsData {
  id: number;
  user_id: string;
  seller_ref: string;
  company_name: string;
  company_country: string;
  company_address: string;
  company_city: string | null;
  company_state: string | null;
  company_postal_code: string | null;
  company_email: string | null;
  company_logo: string | null;
  is_registered_business: boolean;
  business_industry: string;
  business_location: string;
  business_registration_location: string | null;
  business_registration_number: string | null;
  business_type: string;
  business_description: string;
  certificate_of_registration: string | null;
  CAC_No: string | null;
  CAC_No_file: string | null;
  tax_identification_number: string | null;
  tax_identification_file: string | null;
  vat_number: string | null;
  bank_details: any | null;
  bank_verification_status: "VERIFIED" | "UNVERIFIED" | "PENDING" | string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string | null;
  landmark: string;
  phone: string;
  phone2: string | null;
  dob: string | null;
  nationality: string;
  residence_country: string;
  profile_picture: string | null;
  shipping_address: SellerAddress | null;
  return_address: SellerAddress | null;
  company_address_line_2: string | null;
  shipping_zone: string;
  active_products: number;
  total_products: number;
  total_orders: number;
  total_revenue: number | null;
  wallet_balance: number;
  user_is_active: boolean;
  user_account_status: string;
  user_date_created: string;
  user_email: string;
  user_status?: string;
  created_at: string;
  last_login: string | null;
  last_login_ip: string | null;
  last_login_location: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  suspension_reason_display: string | null;
  suspension_note: string;
  is_deleted: boolean;
  deleted_at: string | null;
  deletion_reason: string | null;
  deletion_note: string;
  documents: any[];
  identification_verifications: any[];
  is_fully_verified: boolean;
  is_warehouse: boolean;
  kyc_status: "PENDING" | "VERIFIED" | "REJECTED" | string;
  kyc_status_display: string;
  kyc_submitted_at: string;
  kyc_rejection_reason: string | null;
  kyc_rejection_reason_display: string | null;
  kyc_rejection_note: string;
  kyc_reviewed_at: string | null;
  kyc_reviewed_by: string | null;
  last_product_added: string | null;
  last_order_date: string | null;
  loyalty_points: number;
  pending_documents: number;
  total_documents: number;
  verified_documents: number;
  warehouse: any | null;
  website: string | null;
  verification_progress: VerificationProgress;
  time_in_queue_seconds: number;
}

export interface KycVerificationData {
  business_location: string | null;
  business_name: string | null;
  business_type: string;
  id: number;
  phone: string;
  phone2: string | null;
  seller_ref: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | string;
  status_display: string;
  submission_date: string;
  time_in_queue_display: string;
  time_in_queue_seconds: number;
  user_id: string;
  shipping_address?: SellerAddress | null;
  return_address?: SellerAddress | null;
}

export interface AdminProductData {
  id: string;
  name: string;
  slug: string;
  stockcode: string;
  brand: string;
  manufacturer_name: string;
  category: {
    id: string | number;
    name: string;
    slug?: string;
  } | null;
  base_price: string;
  price_range: {
    min: string;
    max: string;
  } | null;
  inventory: number;
  sold: number;
  is_active: boolean;
  has_variations: boolean;
  variation_count: number;
  rating_average: number;
  main_image: {
    medium: string;
    thumbnail: string;
  } | null;
  created_at: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  is_approved: "approved" | "pending" | "rejected";
}

// ─── Admin Product Detail (single product full response) ──────────────────────

export interface AdminProductDetailImage {
  id: string;
  alt_text: string;
  thumbnail: string;
  medium: string;
  large: string;
  url?: string;
  cloudinary_id?: string;
}

export interface AdminProductDetailVariationValue {
  id: string;
  value: string;
  slug: string;
  display_order: number;
  extra_data: Record<string, string>;
  min_price: string;
  max_price: string;
  available_variations_count: number;
  has_stock: boolean;
}

export interface AdminProductDetailExtraField {
  name: string;
  label: string;
  default?: string;
}

export interface AdminProductDetailVariationOption {
  attribute_id: string;
  attribute_name: string;
  display_order: number;
  extra_fields: AdminProductDetailExtraField[];
  values: AdminProductDetailVariationValue[];
}

export interface AdminProductDetailVariation {
  id: string;
  sku: string;
  name: string;
  attribute_summary: Record<string, string>;
  base_price: number;
  final_price: string;
  has_discount: boolean;
  stock: number;
  is_default: boolean;
  images: AdminProductDetailImage[];
  main_image_url: string;
}

export interface AdminProductDetailAvailableAttribute {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface AdminProductDetailBulkPriceTier {
  min_qty: number;
  max_qty: number | null;
  price: string;
}

export interface AdminProductDetailCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  subcategory: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
}

export interface AdminProductDetail {
  id: string;
  name: string;
  slug: string;
  stockcode: string;
  brand: string;
  manufacturer_name: string;

  category: AdminProductDetailCategory;

  description: string;
  description_html: string;

  whatsinbox: string;
  whatsinbox_html: string;

  specifications: any[];
  specifications_html: string;
  specifications_text: string | null;

  features: any[];

  base_price: number;
  price_range: {
    min: string;
    max: string;
    currency: string;
  };

  bulk_price_threshold: number;
  bulk_price_tiers: AdminProductDetailBulkPriceTier[];
  has_bulk_pricing: boolean;

  inventory: number;
  sold: number;
  sales_percentage: number;
  rating_average: number;
  weight: number | null;

  main_image: string; // direct URL string from API
  images: AdminProductDetailImage[];

  has_variations: boolean;
  variation_count: number;
  available_attributes: AdminProductDetailAvailableAttribute[];
  variation_options: Record<string, AdminProductDetailVariationOption>;
  variations: AdminProductDetailVariation[];

  is_active: boolean;
  is_published: boolean;
  is_approved: "approved" | "pending" | "rejected" | "pending_update" | string;
  can_edit: boolean;

  activation_requested: boolean;
  deactivation_requested: boolean;
  rejection_reason: string;

  created_at: string;
}
