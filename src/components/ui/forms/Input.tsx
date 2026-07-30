import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  valid?: boolean;
  validatePhone?: boolean;
  validateName?: boolean;
  validateEmail?: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, valid = true, validatePhone = false, validateName = false, validateEmail = false, value, onChange, onClick, readOnly, placeholder, onBlur, ...props }, ref) => {
    const [phoneError, setPhoneError] = React.useState<string>("");
    const [phoneTouched, setPhoneTouched] = React.useState(false);

    const [emailError, setEmailError] = React.useState<string>("");
    const [emailTouched, setEmailTouched] = React.useState(false);

    const PHONE_REGEX = /^[0-9+\-\s().]*$/;

    const validatePhoneValue = (val: string) => {
      if (!val || val.trim() === "") {
        setPhoneError("");
        return;
      }
      if (!PHONE_REGEX.test(val)) {
        setPhoneError("Phone number must contain only digits, +");
      } else {
        setPhoneError("");
      }
    };

    const validateEmailValue = (val: string) => {
      if (!val || val.trim() === "") {
        setEmailError("");
        return;
      }
      if (!val.includes("@")) {
        setEmailError(`Please include an '@' in the email address. '${val}' is missing an '@'.`);
      } else {
        const [username, domain] = val.split("@");
        if (!username || username.trim() === "") {
          setEmailError(`Please enter a username before the '@' in '${val}'.`);
        } else if (!domain || domain.trim() === "") {
          setEmailError(`Please enter a domain after the '@' in '${val}'.`);
        } else if (!domain.includes(".") || domain.split(".").some((part) => !part)) {
          setEmailError(`Please enter a valid domain (e.g. gmail.com) after '@' in '${val}'.`);
        } else if (!EMAIL_REGEX.test(val)) {
          setEmailError("Please enter a valid email address.");
        } else {
          setEmailError("");
        }
      }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val !== "" && !PHONE_REGEX.test(val)) {
        setPhoneError("Phone number must contain only digits, +");
        setPhoneTouched(true);
        return;
      }
      if (phoneTouched) validatePhoneValue(val);
      if (onChange) onChange(e);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (emailTouched) validateEmailValue(val);
      if (onChange) onChange(e);
    };

    const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setEmailTouched(true);
      validateEmailValue(e.target.value as string);
      if (onBlur) onBlur(e);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const sanitized = val.replace(/[^a-zA-Z\s'-]/g, "");
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name: e.target.name,
            value: sanitized,
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setPhoneTouched(true);
      validatePhoneValue(e.target.value as string);
      if (onBlur) onBlur(e);
    };

    const isPhoneInvalid = validatePhone && phoneTouched && !!phoneError;
    const isEmailInvalid = (validateEmail || type === "email") && emailTouched && !!emailError;

    const inputClasses = cn(
      "h-12 px-3.5 w-full rounded-c8 text-gray-700 border outline-none md:text-sm",
      isPhoneInvalid || isEmailInvalid
        ? "border-[#CA0202] focus:border-[#CA0202] focus:ring-1 focus:ring-[#CA0202]"
        : valid
        ? "border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b"
        : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500",
      "focus:ring-offset-0",
      type === "date-custom" ? "cursor-pointer" : "",
      className
    );

    const [showCalendar, setShowCalendar] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Parse date from value or fallback to today
    const parsedDate = React.useMemo(() => {
      if (typeof value === "string" && value) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) return d;
      }
      return new Date();
    }, [value]);

    const [currentDate, setCurrentDate] = React.useState(parsedDate);

    // Keep currentDate synced if value updates from outside
    React.useEffect(() => {
      if (value) {
        const d = new Date(value as string);
        if (!isNaN(d.getTime())) {
          setCurrentDate(d);
        }
      }
    }, [value]);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowCalendar(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (type === "date-custom") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();
      const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

      const handleDateSelect = (day: number) => {
        const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (onChange) {
          const synthEvent = {
            target: {
              name: props.name || "",
              value: formattedDate
            }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(synthEvent);
        }
        setShowCalendar(false);
      };

      const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
      };

      const changeYear = (y: number) => {
        setCurrentDate(new Date(y, currentDate.getMonth(), 1));
      };

      const changeMonthByName = (monthIndex: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
      };

      return (
        <div ref={containerRef} className="relative text-gray-700 w-full overflow-visible">
          <input
            type="text"
            className={inputClasses}
            ref={ref}
            value={value}
            readOnly={true}
            placeholder={placeholder || "YYYY-MM-DD"}
            onClick={(e) => {
              setShowCalendar(!showCalendar);
              if (onClick) onClick(e);
            }}
            {...props}
          />
          <div className="absolute z-30 right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
          </div>

          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 top-full mt-2 bg-white border border-[#e0e0e0] shadow-xl rounded-xl p-4 z-[9999] w-[280px]"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronLeft size={16} className="text-[#666666]" />
                  </button>
                  <div className="flex gap-1.5">
                    <select
                      value={currentDate.getMonth()}
                      onChange={(e) => changeMonthByName(parseInt(e.target.value, 10))}
                      className="text-xs font-MontserratSemiBold bg-transparent outline-none border-none cursor-pointer"
                    >
                      {MONTHS.map((m, i) => (
                        <option key={m} value={i}>{m.slice(0, 3)}</option>
                      ))}
                    </select>

                    <select
                      value={currentDate.getFullYear()}
                      onChange={(e) => changeYear(parseInt(e.target.value, 10))}
                      className="text-xs font-MontserratSemiBold bg-transparent outline-none border-none cursor-pointer"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronRight size={16} className="text-[#666666]" />
                  </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <span key={day} className="text-[10px] font-MontserratBold text-[#999999]">
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <span key={`empty-${idx}`} />
                  ))}
                  {daysArray.map((day) => {
                    const isSelected =
                      value === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`text-xs p-1 rounded-lg font-MontserratMedium hover:bg-[#FF715B]/10 hover:text-[#FF715B] transition-colors ${
                          isSelected ? "bg-[#FF715B] text-white hover:bg-[#FF715B] hover:text-white" : "text-[#161616]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    const shouldValidateEmail = validateEmail || type === "email";

    return (
      <div className="w-full">
        {validatePhone && isPhoneInvalid && (
          <p style={{ fontSize: "11px", color: "#CA0202", marginBottom: "4px" }}>
            {phoneError}
          </p>
        )}
        {shouldValidateEmail && isEmailInvalid && (
          <p style={{ fontSize: "11px", color: "#CA0202", marginBottom: "4px" }}>
            {emailError}
          </p>
        )}
        <div className="relative text-gray-700 w-full">
          <input
            type={shouldValidateEmail ? "text" : type}
            className={inputClasses}
            ref={ref}
            value={value}
            onChange={
              validateName
                ? handleNameChange
                : validatePhone
                ? handlePhoneChange
                : shouldValidateEmail
                ? handleEmailChange
                : onChange
            }
            onBlur={
              validatePhone
                ? handlePhoneBlur
                : shouldValidateEmail
                ? handleEmailBlur
                : onBlur
            }
            onClick={onClick}
            readOnly={readOnly}
            placeholder={placeholder}
            {...props}
          />
          {icon && (
            <div className="absolute z-30 right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
