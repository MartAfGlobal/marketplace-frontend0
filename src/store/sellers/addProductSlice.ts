// store/productFormSlice.ts
import { EffectiveAttribute } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------- Types ---------- */

export interface Variation {
  attribute_value_ids: string[];
  base_price: string;
  stock: number;
  is_default: boolean;
  gender: string;
  age_group: string;
  low_stock_threshold: number;
  images: File[];
}



export interface Feature {
  name: string;
  value: string;
}

export interface Specification {
  title: string;
  text: string;
  image?: File;
}

interface ProductFormState {
  step1: {
   
    id?: string;
    attributes?: EffectiveAttribute[];
  };

  // step2: {
  //   variations: Variation[];
  // };

  // step3: {
  //   whats_in_box?: string;
  //   specifications_text?: string;

  //   features: Feature[];
  //   specifications: Specification[];

  //   is_active?: boolean;
  //   is_draft?: boolean;
  //   is_published?: boolean;
  // };
}

/* ---------- Initial State ---------- */

const initialState: ProductFormState = {
  step1: {
    id: "",
    attributes: [],
  },

  // step2: {
  //   variations:[],
  // },

  // step3: {
  //   whats_in_box: "",
  //   specifications_text: "",
  //   features: [],
  //   specifications: [],
    
  // },
};

/* ---------- Slice ---------- */

const productFormSlice = createSlice({
  name: "productForm",
  initialState,
  reducers: {
    setStep1Data(
      state,
      action: PayloadAction<Partial<ProductFormState["step1"]>>,
    ) {
      state.step1 = { ...state.step1, ...action.payload };
    },

    // setStep2Data(
    //   state,
    //   action: PayloadAction<Partial<ProductFormState["step2"]>>,
    // ) {
    //   state.step2 = { ...state.step2, ...action.payload };
    // },

    // setStep3Data(
    //   state,
    //   action: PayloadAction<Partial<ProductFormState["step3"]>>,
    // ) {
    //   state.step3 = { ...state.step3, ...action.payload };
    // },

    resetForm: () => initialState,
  },
});

/* ---------- Exports ---------- */

export const { setStep1Data, resetForm } =
  productFormSlice.actions;

export default productFormSlice.reducer;
