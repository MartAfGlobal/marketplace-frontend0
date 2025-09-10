"use client";
import { useState, useEffect } from "react";
;


export default function BestSelling() {
  const targets = [75, 15];
  const [progresses, setProgresses] = useState<number[]>(targets.map(() => 0));

  useEffect(() => {
    let start = [...progresses];

    const interval = setInterval(() => {
      let done = true;

      start = start.map((value, index) => {
        if (value < targets[index]) {
          done = false;
          return value + 1;
        }
        return value;
      });

      setProgresses([...start]);

      if (done) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-ffffff rounded-c16 h-30 px-c32 py-5.5 space-y-4">
        <p className="text-base font-MontserratSemiBold ">Best selling</p>
      {["Anker shoes"].map((label, index) => (
        <div key={label} className={`mt-${index === 0 ? 9 : 4} w-full`}>
          <div className="flex justify-between w-full max-w-66">
            <span className="text-base font-MontserratMedium">{label}</span>
            <span className="text-c10 font-MontserratMedium">
              {progresses[index]}%
            </span>
          </div>

          <div className="relative w-full h-2 rounded-c4 bg-black/5 overflow-hidden">
            <div
              className="h-2 rounded-c4 transition-all duration-100 ease-out"
              style={{
                width: `${progresses[index]}%`,
                background: progresses[index] < 50
                  ? `linear-gradient(0deg, #947FFF, #947FFF), linear-gradient(0deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.32))`
                  : `#947FFF`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
