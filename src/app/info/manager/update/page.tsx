"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Image as ImageIcon, LayoutGrid, Loader2, LogOut } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";

// Components
import CategoryForm from "../../components/manager/CategoryForm";
import ImageForm from "../../components/manager/ImageForm";
import CountryForm from "../../components/manager/CountryForm";
import DashboardList from "../../components/manager/DashboardList";

interface ManagedCategory {
  id: string;
  name: string;
  image: string;
}

interface LoopImage {
  id: string;
  image: string;
}

interface ManagedCountry {
  id: string;
  name: string;
}

interface SelectedFile {
  file: File;
  preview: string;
  title: string;
}

type TabType = "categories" | "images" | "countries";

export default function ManagerUpdatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("categories");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data State
  const [categories, setCategories] = useState<ManagedCategory[]>([]);
  const [loopImages, setLoopImages] = useState<LoopImage[]>([]);
  const [countries, setCountries] = useState<ManagedCountry[]>([]);

  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Guard: redirect to admin login if no token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please log in to access the manager dashboard.");
      router.replace("/auth/admin/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, imgRes, countryRes] = await Promise.all([
        axios.get("/website/admin/categories/"),
        axios.get("/website/admin/images/"),
        axios.get("/website/admin/countries/")
      ]);
      
      console.log("[Manager] categories raw:", catRes.data);
      console.log("[Manager] images raw:", imgRes.data);
      console.log("[Manager] countries raw:", countryRes.data);

      const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
      const imgs = Array.isArray(imgRes.data) ? imgRes.data : imgRes.data?.results || [];
      const ctrs = Array.isArray(countryRes.data) ? countryRes.data : countryRes.data?.results || [];

      console.log("[Manager] parsed categories:", cats);
      console.log("[Manager] parsed images:", imgs);
      console.log("[Manager] parsed countries:", ctrs);

      setCategories(cats);
      setLoopImages(imgs);
      setCountries(ctrs);
    } catch (e) {
      console.error("Failed to fetch data", e);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (name: string, isActive: boolean) => {
    setIsSubmitting(true);
    const payload = { name, is_active: isActive };

    try {
      if (editingItem) {
        await axios.patch(`/website/admin/categories/${editingItem.id}/`, payload);
        toast.success("Category updated successfully");
      } else {
        await axios.post("/website/admin/categories/", payload);
        toast.success("Category added successfully");
      }
      setEditingItem(null);
      fetchData();
    } catch (e) {
      console.error("Failed to submit category", e);
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSubmit = async (files: SelectedFile[]) => {
    setIsSubmitting(true);
    const formData = new FormData();
    files.forEach(item => {
      formData.append("images", item.file);
      formData.append("titles", item.title);
    });

    try {
      await axios.post("/website/admin/images/bulk/", formData);
      toast.success(`${files.length} images added to loop`);
      fetchData();
    } catch (e) {
      console.error("Failed to add images", e);
      toast.error("Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCountrySubmit = async (name: string) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await axios.patch(`/website/admin/countries/${editingItem.id}/`, { name });
        toast.success("Country updated successfully");
      } else {
        await axios.post("/website/admin/countries/", { name });
        toast.success("Country added successfully");
      }
      setEditingItem(null);
      fetchData();
    } catch (e) {
      console.error("Failed to submit country", e);
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    let endpoint = "";
    if (activeTab === "categories") endpoint = `/website/admin/categories/${id}/`;
    else if (activeTab === "images") endpoint = `/website/admin/images/${id}/`;
    else if (activeTab === "countries") endpoint = `/website/admin/countries/${id}/`;

    try {
      await axios.delete(endpoint);
      toast.success("Item deleted");
      if (editingItem?.id === id) setEditingItem(null);
      fetchData();
    } catch (e) {
      console.error("Failed to delete", e);
      toast.error("Failed to delete item");
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setEditingItem(null);
  };

  return (
    <main className="min-h-screen bg-[#f8f8ff] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-MontserratMedium text-[#6b6b7a]">PM Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-MontserratBold text-[#1f1f35]">Manager Tools</h1>
            <p className="max-w-2xl text-sm leading-6 text-[#5a5a70]">
              Manage categories, images, and countries for the Africa to the World program.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
            <Link
              href="/info"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dcdce4] bg-white px-4 sm:px-5 py-2.5 text-sm font-MontserratSemiBold text-[#3b3b4f] shadow-sm transition hover:border-6a0dad/50 hover:text-6a0dad"
            >
              <ChevronLeft size={18} /> Back to Info
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                toast.success("Logged out successfully");
                router.replace("/auth/admin/login");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 sm:px-5 py-2.5 text-sm font-MontserratSemiBold text-red-400 shadow-sm transition hover:border-red-400 hover:text-red-600"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-[#eaeaef] rounded-2xl w-full overflow-x-auto border border-[#dedede] scrollbar-hide">
          <button
            onClick={() => handleTabChange("categories")}
            className={`flex items-center gap-2 px-3 sm:px-6 py-3 rounded-xl text-sm font-MontserratBold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === "categories" 
                ? "bg-white text-6a0dad shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid size={18} /> Categories
          </button>
          <button
            onClick={() => handleTabChange("images")}
            className={`flex items-center gap-2 px-3 sm:px-6 py-3 rounded-xl text-sm font-MontserratBold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === "images" 
                ? "bg-white text-6a0dad shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ImageIcon size={18} /> Loop Images
          </button>
          <button
            onClick={() => handleTabChange("countries")}
            className={`flex items-center gap-2 px-3 sm:px-6 py-3 rounded-xl text-sm font-MontserratBold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === "countries" 
                ? "bg-white text-6a0dad shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="w-4.5 h-4.5 flex items-center justify-center">🌍</div> Countries
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-6a0dad" size={40} />
            <p className="text-gray-400 font-MontserratMedium">Synchronizing with backend...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1fr_0.8fr] items-start">
            {/* Form Section */}
            <section className="lg:sticky lg:top-24 rounded-[32px] border border-[#e8e8f6] bg-white p-4 sm:p-8 shadow-[0_24px_70px_rgba(16,24,40,0.06)]">
              <h2 className="text-lg sm:text-xl font-MontserratBold text-[#1f1f35] mb-6 sm:mb-8 flex items-center gap-2">
                <Plus size={20} className="text-6a0dad" /> 
                <span className="truncate">
                  {editingItem ? "Edit Existing" : "Add New"}{" "}
                  {activeTab === "categories" ? "Waitlist Category" : activeTab === "images" ? "Loop Images" : "Target Country"}
                </span>
              </h2>
              
              {activeTab === "categories" && (
                <CategoryForm 
                  onSubmit={handleCategorySubmit} 
                  isSubmitting={isSubmitting} 
                  initialData={editingItem}
                  onCancel={() => setEditingItem(null)}
                />
              )}
              {activeTab === "images" && (
                <ImageForm onSubmit={handleImageSubmit} isSubmitting={isSubmitting} />
              )}
              {activeTab === "countries" && (
                <CountryForm 
                  onSubmit={handleCountrySubmit} 
                  isSubmitting={isSubmitting} 
                  initialData={editingItem}
                  onCancel={() => setEditingItem(null)}
                />
              )}
            </section>

            {/* List Section */}
            <DashboardList 
              items={activeTab === "categories" ? categories : activeTab === "images" ? loopImages : countries} 
              type={activeTab} 
              onDelete={handleDelete}
              onEdit={setEditingItem}
            />
          </div>
        )}
      </div>
    </main>
  );
}
