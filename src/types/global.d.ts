// import Button from "@/components/ui/Button/Button";
// import { title } from "process";

import { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // if no href, render as plain text
}

type Category = {
  name: string;
  icon: string | StaticImageData;
  subcategories: string[];
};
type CategoryD = {
  name: string;
  subcategories: string | ReactNode;
};

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
  icon: string| StaticImageData;
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
}
interface ProductPageProps {
  params: Promise<{ slug: string }>;
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


type DropdownModalProps = {
  open: boolean;
  onClose: () => void;
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


export interface QuantitySelectorProps {
  productId: string | number;  
  initialQty?: number;
  onChange?: (quantity: number, productId: string | number) => void;
}
