import { useState } from "react";
import { africaLocationData } from "../countrydata";
import { DropdownInput } from "./business-type";

export default function LocationForm() {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // dynamically get states & cities
  const states = country ? Object.keys(africaLocationData[country].states) : [];
  const cities = country && state ? africaLocationData[country].states[state] : [];

  return (
    <div className="flex gap-4">
      {/* Country */}
      <DropdownInput
        placeholder="Select country"
        options={Object.keys(africaLocationData)}
        value={country}
        onChange={(val) => {
          setCountry(val);
          setState(""); // reset
          setCity(""); // reset
        }}
      />

      {/* State */}
      <DropdownInput
        placeholder="Select state"
        options={states}
        value={state}
        onChange={(val) => {
          setState(val);
          setCity(""); // reset
        }}
        disabled={!country}
      />

      {/* City */}
      <DropdownInput
        placeholder="Select city"
        options={cities}
        value={city}
        onChange={setCity}
        disabled={!state}
      />
    </div>
  );
}
