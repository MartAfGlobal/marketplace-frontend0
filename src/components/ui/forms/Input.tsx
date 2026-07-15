import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  valid?: boolean; 
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, valid = true, value, onChange, onClick, readOnly, placeholder, ...props }, ref) => {
    const inputClasses = cn(
      "h-12 px-3.5 w-full rounded-c8 text-gray-700 border outline-none md:text-sm",
      valid ? "border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b" : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500",
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

    return (
      <div className="relative text-gray-700 w-full">
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          value={value}
          onChange={onChange}
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
    );
  }
);

Input.displayName = "Input";
export { Input };
