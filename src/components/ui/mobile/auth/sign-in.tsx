import { useHttp } from "@/hooks/use-http";
import { tokenActions } from "@/store/token/token-slice";
import { LoginParams, MobileLoginProps } from "@/types/global";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";

import Mail from "@/assets/FormIcon/email.svg";
import { LoadingSpinner } from "../../loading-spinner";

export default function MobileLogin({ onClose, setStep }: MobileLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const rememberKey = "rememberLogin_buyer";

  const [formData, setFormData] = useState<LoginParams>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const dispatch = useDispatch();

  const { loading: logingLoading, sendHttpRequest: loginRequest } = useHttp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(rememberKey);
    if (!stored) {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.email && parsed?.password) {
        setFormData({
          email: parsed.email,
          password: parsed.password,
          rememberMe: true,
        });
      }
    } catch {
      localStorage.removeItem(rememberKey);
    }
  }, [rememberKey]);

  const loginSuccess = (res: any) => {
    const accessToken = res?.data?.access;

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

    if (typeof window === "undefined") return;

    if (formData.rememberMe) {
      localStorage.setItem(
        rememberKey,
        JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      );
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    } else {
      localStorage.removeItem(rememberKey);
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    }

    dispatch(tokenActions.setToken(accessToken));
    toast.success("Login successful!");
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    loginRequest({
      requestConfig: {
        url: "/accounts/login",
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
          check: formData.rememberMe,
        },
        userType: "buyer",
      },
      successRes: loginSuccess,
    });
  };

  const isFormValid = formData.email !== "" && formData.password !== "";

  return (
    <form onSubmit={handleLogin} className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-MontserratSemiBold text-c20">Sign in</h2>
        <p className="font-MontserratNormal text-sm">
          Welcome back! Please log in to continue.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative w-full">
          <Image
            src={Mail}
            alt="Email"
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-black/10 rounded-lg pl-10 pr-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
            placeholder="Email address"
          />
        </div>

        {/* Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-black/10 rounded-lg pr-10 pl-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
              className="peer h-5 w-5 rounded-c4 border cursor-pointer border-ff715b appearance-none checked:bg-ff715b checked:border-ff715b"
            />
            <span className="absolute left-0 top-0 h-5 w-5 flex items-center justify-center text-white font-bold scale-0 peer-checked:scale-100 transition-transform">
              ✓
            </span>
            <span className="text-c12 font-MontserratMedium text-161616">
              Remember me
            </span>
          </label>
        </div>

        <button
          disabled={logingLoading || !isFormValid}
          className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold flex items-center justify-center"
        >
          {logingLoading ? <LoadingSpinner /> : "Sign In"}
        </button>

        <button
          onClick={() => setStep("forgot")}
          className="text-sm text-6a0dad font-MontserratSemiBold text-left"
        >
          Forgot password?
        </button>
      </div>

      <p className="text-sm text-center font-MontserratNormal">
        Don’t have an account?{" "}
        <span
          onClick={() => setStep("signup")}
          className="text-6a0dad font-medium cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </form>
  );
}
