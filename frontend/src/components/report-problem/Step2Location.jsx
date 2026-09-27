import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Edit3,
  ShieldAlert,
  Check,
  Globe,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText, localizeAddress } from "../../i18n/citizenUi";

const JHARKHAND_DISTRICTS = [
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Giridih",
  "Godda",
  "Gumla",
  "Hazaribagh",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Palamu",
  "Ramgarh",
  "Ranchi",
  "Sahibganj",
  "Seraikela-Kharsawan",
  "Simdega",
  "West Singhbhum",
];

const Step2Location = ({ formData, updateFormData, onNext, onBack }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const [activeTab, setActiveTab] = useState(
    formData.locationMode || "geolocation"
  );

  const [isLocating, setIsLocating] = useState(false);
  const [locSuccess, setLocSuccess] = useState("");
  const [locError, setLocError] = useState("");

  const [mapPin, setMapPin] = useState({
    x: formData.mapPinX || 50,
    y: formData.mapPinY || 50,
  });

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setLocSuccess("");
    setLocError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );

            if (response.ok) {
              const data = await response.json();
              const addressObj = data.address || {};

              const fetchedAddress =
                data.display_name ||
                `${addressObj.road || addressObj.suburb || "Current GPS Location"}, ${
                  addressObj.city ||
                  addressObj.town ||
                  addressObj.village ||
                  addressObj.state ||
                  ""
                }`;

              const fetchedCity =
                addressObj.city ||
                addressObj.town ||
                addressObj.village ||
                addressObj.municipality ||
                "";

              const fetchedState = addressObj.state || "Jharkhand";

              const fetchedPostal = addressObj.postcode || "";

              const fetchedDistrict =
                addressObj.state_district ||
                addressObj.district ||
                addressObj.county ||
                "";

              const matchedDistrict = JHARKHAND_DISTRICTS.find(
                (district) =>
                  district.toLowerCase() === fetchedDistrict.toLowerCase()
              );

              updateFormData({
                locationMode: "geolocation",
                latitude: lat,
                longitude: lng,
                address: fetchedAddress,
                city: fetchedCity || formData.city || "",
                state: fetchedState,
                postalCode: fetchedPostal,
                district: matchedDistrict || fetchedDistrict || formData.district || "",
              });

              setLocSuccess(
                fetchedCity
                  ? `GPS Location fetched: ${fetchedCity}, ${fetchedState}`
                  : `GPS Coordinates fetched: ${lat}, ${lng}`
              );
            } else {
              throw new Error("Reverse geocoding failed");
            }
          } catch (error) {
            console.warn("Reverse geocoding error:", error);

            updateFormData({
              locationMode: "geolocation",
              latitude: lat,
              longitude: lng,
              address: `GPS Coordinates (${lat}, ${lng})`,
              state: formData.state || "Jharkhand",
              city: formData.city || "",
              district: formData.district || "",
            });

            setLocSuccess(
              `GPS Coordinates fetched: Lat ${lat}, Lng ${lng}`
            );
          } finally {
            setIsLocating(false);

            setTimeout(() => {
              setLocSuccess("");
            }, 5000);
          }
        },

        (error) => {
          console.warn("Geolocation error:", error);

          let errorMsg =
            "Unable to detect your location. Please enable GPS/location services and try again.";

          if (error.code === error.PERMISSION_DENIED) {
            errorMsg =
              "Location permission was denied. Please allow location access in your browser settings and try again.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg =
              "Unable to detect your location. Please enable GPS/location services and try again.";
          } else if (error.code === error.TIMEOUT) {
            errorMsg =
              "Unable to detect your location. Please enable GPS/location services and try again.";
          }

          setLocError(errorMsg);
          setIsLocating(false);

          updateFormData({
            locationMode: "geolocation",
            latitude: "",
            longitude: "",
          });
        },

        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    } else {
      setLocError(
        "Unable to detect your location. Please enable GPS/location services and try again."
      );
      setIsLocating(false);
    }
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMapPin({
      x,
      y,
    });

    /*
     * Jharkhand approximate map coordinates.
     *
     * Latitude range roughly:
     * 21.9 - 25.3
     *
     * Longitude range roughly:
     * 83.3 - 87.9
     *
     * This is only a visual/mock picker.
     * Actual map integration can later replace this.
     */
    const mockLat = (
      21.9 +
      ((100 - y) / 100) * (25.3 - 21.9)
    ).toFixed(6);

    const mockLng = (
      83.3 +
      (x / 100) * (87.9 - 83.3)
    ).toFixed(6);

    updateFormData({
      locationMode: "map",

      mapPinX: x,
      mapPinY: y,

      latitude: mockLat,
      longitude: mockLng,

      address: `Selected Map Point (Lat: ${mockLat}, Lng: ${mockLng})`,

      state: "Jharkhand",

      city: formData.city || "",
      district: formData.district || "",
    });
  };

  return (
    <div className="space-y-6">
      {/* --------------------------------
          LOCATION SELECTION TABS
      --------------------------------- */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* GPS */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("geolocation");
            handleGetCurrentLocation();
          }}
          disabled={isLocating}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            activeTab === "geolocation"
              ? "border-emerald-500 bg-emerald-500/10 text-white"
              : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            {isLocating ? (
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {isLocating ? "Fetching GPS..." : "Use My Location"}
            </h4>

            <p className="text-[11px] text-slate-400">
              {rt("deviceGps")}
            </p>
          </div>
        </button>

        {/* MAP */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("map");

            updateFormData({
              locationMode: "map",
              state: "Jharkhand",
            });
          }}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            activeTab === "map"
              ? "border-emerald-500 bg-emerald-500/10 text-white"
              : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <Globe className="h-5 w-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {rt("selectMap")}
            </h4>

            <p className="text-[11px] text-slate-400">
              {rt("clickDragPin")}
            </p>
          </div>
        </button>

        {/* MANUAL */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("manual");

            updateFormData({
              locationMode: "manual",
              state: "Jharkhand",
            });
          }}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            activeTab === "manual"
              ? "border-emerald-500 bg-emerald-500/10 text-white"
              : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <Edit3 className="h-5 w-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {rt("enterManually")}
            </h4>

            <p className="text-[11px] text-slate-400">
              {rt("typeAddress")}
            </p>
          </div>
        </button>
      </div>

      {/* --------------------------------
          SUCCESS MESSAGE
      --------------------------------- */}
      {locSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-300 animate-fade-in">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />

          {locSuccess}
        </div>
      )}

      {/* --------------------------------
          ERROR MESSAGE
      --------------------------------- */}
      {locError && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-bold text-amber-300 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />

          {locError}
        </div>
      )}

      {/* --------------------------------
          INTERACTIVE MAP
      --------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 p-1">
        <div className="mb-2 flex items-center justify-between px-4 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <MapPin className="h-4 w-4 text-emerald-400" />

            {rt("locationPicker")}
          </span>

          <span className="text-[11px] text-slate-400">
            {rt("mapHint")}
          </span>
        </div>

        <div
          onClick={handleMapClick}
          className="relative h-64 w-full cursor-crosshair overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 50% 50%,
                rgba(16, 185, 129, 0.08) 0%,
                transparent 60%
              ),
              linear-gradient(
                to right,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              "100% 100%, 24px 24px, 24px 24px",
          }}
        >
          {/* Simulated roads */}
          <div className="absolute left-1/4 top-0 h-full w-4 -rotate-12 transform bg-slate-800/40" />

          <div className="absolute left-0 top-1/2 h-4 w-full bg-slate-800/40" />

          <div className="absolute right-1/3 top-0 h-full w-3 bg-emerald-900/20" />

          {/* Privacy Circle */}
          {formData.isApproximate && (
            <div
              className="absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-emerald-400/60 bg-emerald-500/10 transition-all duration-300"
              style={{
                left: `${mapPin.x}%`,
                top: `${mapPin.y}%`,
              }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-emerald-500/30 bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {rt("privacyRadius")}
              </span>
            </div>
          )}

          {/* Pin */}
          <div
            className="absolute -translate-x-1/2 -translate-y-full transition-all duration-200"
            style={{
              left: `${mapPin.x}%`,
              top: `${mapPin.y}%`,
            }}
          >
            <div className="relative flex flex-col items-center">
              <div className="rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-bold text-slate-950 shadow-lg">
                {rt("selectedPoint")}
              </div>

              <MapPin className="h-8 w-8 animate-bounce text-emerald-400 filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------
          LOCATION DETAILS
      --------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* ADDRESS */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            Full Address / Landmark{" "}
            <span className="text-emerald-400">*</span>
          </label>

          <input
            type="text"
            placeholder={rt("addressPlaceholder")}
            value={formData.address || ""}
            onChange={(e) =>
              updateFormData({
                address: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        {/* CITY */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            City / Town{" "}
            <span className="text-emerald-400">*</span>
          </label>

          <input
            type="text"
            placeholder={rt("cityPlaceholder")}
            value={formData.city || ""}
            onChange={(e) =>
              updateFormData({
                city: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        {/* STATE */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            {rt("state")} <span className="text-emerald-400">*</span>
          </label>

          <input
            type="text"
            value="Jharkhand"
            readOnly
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 focus:outline-none"
          />
        </div>

        {/* DISTRICT */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            {rt("district")} <span className="text-emerald-400">*</span>
          </label>

          <select
            value={formData.district || ""}
            onChange={(e) =>
              updateFormData({
                district: e.target.value,
                state: "Jharkhand",
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          >
            <option value="" className="bg-slate-950">
              {rt("selectDistrict")}
            </option>

            {JHARKHAND_DISTRICTS.map((district) => (
              <option
                key={district}
                value={district}
                className="bg-slate-950"
              >
                {localizeAddress(district, language)}
              </option>
            ))}
          </select>
        </div>

        {/* BLOCK */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            {rt("blockArea")}
          </label>

          <input
            type="text"
            placeholder={rt("blockPlaceholder")}
            value={formData.block || ""}
            onChange={(e) =>
              updateFormData({
                block: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        {/* LATITUDE */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            {rt("latitude")}
          </label>

          <input
            type="text"
            readOnly
            value={formData.latitude || ""}
            placeholder={rt("gpsPlaceholder")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-300 placeholder-slate-600"
          />
        </div>

        {/* LONGITUDE */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-300">
            {rt("longitude")}
          </label>

          <input
            type="text"
            readOnly
            value={formData.longitude || ""}
            placeholder={rt("gpsPlaceholder")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-300 placeholder-slate-600"
          />
        </div>
      </div>

      {/* --------------------------------
          PRIVACY
      --------------------------------- */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {rt("approximateLocation")}
            </h4>

            <p className="text-xs text-slate-400">
              Blurs exact house/building number and shows a 500m
              area radius for user privacy
            </p>
          </div>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={formData.isApproximate || false}
            onChange={(e) =>
              updateFormData({
                isApproximate: e.target.checked,
              })
            }
            className="peer sr-only"
          />

          <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
        </label>
      </div>
      <div className="mt-8 flex justify-between"><button type="button" onClick={onBack} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">{rt("previous")}</button><button type="button" onClick={onNext} className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">{rt("next")}</button></div>
    </div>
  );
};

export default Step2Location;