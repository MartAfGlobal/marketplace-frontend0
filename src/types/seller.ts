export interface SellerVerificationSteps {
  company_name: boolean;
  company_address: boolean;
  certificate_of_registration: boolean;
  business_registration_location: boolean;
  company_state: boolean;
  [key: string]: boolean;
}

export interface SellerVerificationProgress {
  completed_steps: number;
  percentage: number;
  steps: SellerVerificationSteps;
  total_steps: number;
}

export interface SellerProfile {
  CAC_No: string;
  CAC_No_file_url: string;
  address: string | null;
  bank_details: any | null;
  bank_verification_status: string;
  business_description: string | null;
  business_industry: string;
  business_registration_location: string | null;
  business_registration_number: string;
  business_type: string;
  certificate_of_registration_url: string;
  city: string | null;
  company_address: string;
  company_city: string | null;
  company_country: string;
  company_logo_url: string | null;
  company_name: string;
  company_postal_code: string | null;
  company_state: string | null;
  country: string;
  created_at: string;
  dob: string | null;
  documents: any[];
  first_name: string | null;
  id: number;
  identification_verifications: any[];
  is_fully_verified: boolean;
  is_registered_business: boolean;
  is_warehouse: boolean;
  landmark: string | null;
  last_name: string | null;
  loyalty_points: number;
  missing_requirements: string[];
  nationality: string | null;
  phone: string;
  phone2: string | null;
  postal_code: string;
  preferred_payment_method: string | null;
  profile_picture_url: string | null;
  residence_country: string;
  shipping_zone: string;
  state: string | null;
  tax_certificate_url: string;
  tax_identification_number: string;
  trust_score: number;
  vat_number: string;
  verification_progress: SellerVerificationProgress;
}

export interface SellerData {
  email: string;
  first_name: string;
  id: string;
  is_manufacturer: boolean;
  last_name: string;
  profile: SellerProfile;
  wallet_balance: string;
  warehouse: string | null;
  website: string | null;
}
