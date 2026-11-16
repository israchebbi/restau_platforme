import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LocateFixed } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import Field from "../../components/Field";
import ImageUpload from "../../components/ImageUpload";
import type { MyRestaurant } from "../../types";
import { isImageUrl } from "../../lib/image";

const num = (text: string) => (text.trim() === "" ? NaN : Number(text));

function OpenToggle({ restaurant }: { restaurant: MyRestaurant }) {
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: (isOpen: boolean) =>
      api.patch("/api/restaurants/me/info", { isOpen }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] }),
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4">
      <div>
        <div className="font-medium text-slate-800">
          {restaurant.isOpen ? "Open for orders" : "Closed"}
        </div>
        <p className="text-sm text-slate-500">
          {restaurant.isOpen
            ? "Clients can order from your restaurant."
            : "Clients still see your restaurant but cannot place orders."}
        </p>
        {toggle.error && (
          <p className="text-sm text-red-600 mt-1">
            {getErrorMessage(toggle.error)}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={restaurant.isOpen}
        aria-label="Accepting orders"
        disabled={toggle.isPending}
        onClick={() => toggle.mutate(!restaurant.isOpen)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60 ${
          restaurant.isOpen ? "bg-green-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
            restaurant.isOpen ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function ProfileForm({ restaurant }: { restaurant: MyRestaurant }) {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState(restaurant.logo ?? "");
  const [name, setName] = useState(restaurant.name);
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const [openingHours, setOpeningHours] = useState(restaurant.openingHours ?? "");
  const [address, setAddress] = useState(restaurant.address);
  const [latitude, setLatitude] = useState(String(restaurant.latitude));
  const [longitude, setLongitude] = useState(String(restaurant.longitude));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [locating, setLocating] = useState(false);

  const save = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      api.patch("/api/restaurants/me/info", values),
    onSuccess: () => {
      setError("");
      setMessage("Changes saved");
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
    },
    onError: (e) => {
      setMessage("");
      setError(getErrorMessage(e));
    },
  });

  function locateMe() {
    if (!navigator.geolocation) {
      setError("Your browser cannot share its location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setError("");
        setLocating(false);
      },
      () => {
        setError("We could not get your location. Enter the coordinates manually.");
        setLocating(false);
      }
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const lat = num(latitude);
    const lng = num(longitude);

    let problem = "";
    if (name.trim().length < 2) problem = "Restaurant name is too short";
    else if (cuisine.trim().length < 2) problem = "Enter your type of cuisine";
    else if (address.trim().length < 3) problem = "Enter your address";
    else if (!(lat >= -90 && lat <= 90)) problem = "Latitude must be between -90 and 90";
    else if (!(lng >= -180 && lng <= 180)) problem = "Longitude must be between -180 and 180";
    else if (logo.trim() && !isImageUrl(logo))
      problem = "The logo link must start with http:// or https://";

    if (problem) {
      setMessage("");
      setError(problem);
      return;
    }

    setError("");
    setMessage("");
    save.mutate({
      name: name.trim(),
      cuisine: cuisine.trim(),
      address: address.trim(),
      latitude: lat,
      longitude: lng,
      openingHours: openingHours.trim(),
      logo: logo || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-5 space-y-4"
    >
      <h2 className="font-medium text-slate-800">Restaurant details</h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2">
          {message}
        </div>
      )}

      <ImageUpload label="Logo" type="logo" value={logo} onChange={setLogo} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id="p-name" label="Restaurant name" value={name} onChange={setName} />
        <Field id="p-cuisine" label="Type of cuisine" value={cuisine} onChange={setCuisine} />
        <Field id="p-hours" label="Opening hours" value={openingHours} onChange={setOpeningHours} placeholder="11:00 - 23:00" />
        <Field id="p-address" label="Address" value={address} onChange={setAddress} />
        <Field id="p-lat" label="Latitude" value={latitude} onChange={setLatitude} />
        <Field id="p-lng" label="Longitude" value={longitude} onChange={setLongitude} />
      </div>

      <button
        type="button"
        onClick={locateMe}
        disabled={locating}
        className="inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 text-sm px-4 py-2 hover:bg-orange-100 disabled:opacity-60"
      >
        <LocateFixed className="h-4 w-4" />
        {locating ? "Locating…" : "Use my current location"}
      </button>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm px-5 py-2 disabled:opacity-60"
        >
          {save.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function Profile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: async () =>
      (await api.get<MyRestaurant>("/api/restaurants/me/info")).data,
  });

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-800">
        Restaurant profile
      </h1>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {error && (
        <p className="text-red-600 text-sm">{getErrorMessage(error)}</p>
      )}

      {data && (
        <>
          <OpenToggle restaurant={data} />
          <ProfileForm key={data.id} restaurant={data} />
        </>
      )}
    </div>
  );
}