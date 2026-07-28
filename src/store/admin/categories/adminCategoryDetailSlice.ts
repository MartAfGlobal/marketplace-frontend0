import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminCategoryDetail {
  id: string | number;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string | null;
  category_image?: string | null;
  cover_image?: string | null;
  icon?: string | null;
  is_active?: boolean;
  status?: string;
  is_hidden?: boolean;
  products_count?: number;
  productsCount?: number;
  product_count?: number;
  total_products?: number;
  parent?: any;
  parent_name?: string;
  parent_category?: any;
  created_at?: string;
  date_created?: string;
  updated_at?: string;
  last_updated?: string;
  attributes?: any;
  subcategories?: any[];
  sub_categories?: any[];
  children?: any[];
  [key: string]: any;
}

interface AdminCategoryDetailState {
  category: AdminCategoryDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminCategoryDetailState = {
  category: null,
  loading: false,
  error: null,
};

const adminCategoryDetailSlice = createSlice({
  name: "adminCategoryDetail",
  initialState,
  reducers: {
    setAdminCategoryDetail(
      state,
      action: PayloadAction<AdminCategoryDetail | null>
    ) {
      state.category = action.payload;
      state.error = null;
    },

    clearAdminCategoryDetail(state) {
      state.category = null;
      state.error = null;
    },

    setAdminCategoryDetailLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminCategoryDetailError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminCategoryDetail,
  clearAdminCategoryDetail,
  setAdminCategoryDetailLoading,
  setAdminCategoryDetailError,
} = adminCategoryDetailSlice.actions;

export default adminCategoryDetailSlice.reducer;
