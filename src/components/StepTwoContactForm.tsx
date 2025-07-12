import React from "react";

interface Props {
  contact: { name: string; email: string; phone: string; timezone?: string };
  setContact: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string; timezone?: string }>>;
  onNext: () => void;
  onBack: () => void;
}

const StepTwoContactForm: React.FC<Props> = ({ contact, setContact, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const timezoneOptions = [
    { label: "Baker Island (UTC-12:00)", value: "Etc/GMT+12" },
    { label: "American Samoa (UTC-11:00)", value: "Etc/GMT+11" },
    { label: "Hawaii (UTC-10:00)", value: "Etc/GMT+10", color: "text-purple-400" },

    { label: "Alaska (UTC-09:00)", value: "Etc/GMT+9", color: "text-rose-400" },
    { label: "Pacific Time (US & Canada) (UTC-08:00)", value: "Etc/GMT+8", color: "text-orange-400" },
    { label: "Mountain Time (US & Canada) (UTC-07:00)", value: "Etc/GMT+7", color: "text-yellow-400" },
    { label: "Central Time (US & Canada) (UTC-06:00)", value: "Etc/GMT+6", color: "text-green-400" },
    { label: "Eastern Time (US & Canada) (UTC-05:00)", value: "Etc/GMT+5", color: "text-cyan-400" },
    { label: "Atlantic Time (Canada) (UTC-04:00)", value: "Etc/GMT+4" },
    { label: "Argentina/Brazil (UTC-03:00)", value: "Etc/GMT+3" },
    { label: "Mid-Atlantic (UTC-02:00)", value: "Etc/GMT+2" },
    { label: "Azores (UTC-01:00)", value: "Etc/GMT+1" },
    { label: "Greenwich Mean Time (UTC+00:00)", value: "Etc/GMT" },
    { label: "Central Europe (UTC+01:00)", value: "Etc/GMT-1" },
    { label: "Eastern Europe (UTC+02:00)", value: "Etc/GMT-2" },
    { label: "Moscow (UTC+03:00)", value: "Etc/GMT-3" },
    { label: "Abu Dhabi (UTC+04:00)", value: "Etc/GMT-4" },
    { label: "Pakistan (UTC+05:00)", value: "Etc/GMT-5" },
    { label: "Bangladesh (UTC+06:00)", value: "Etc/GMT-6" },
    { label: "Thailand (UTC+07:00)", value: "Etc/GMT-7" },
    { label: "China (UTC+08:00)", value: "Etc/GMT-8" },
    { label: "Japan/Korea (UTC+09:00)", value: "Etc/GMT-9" },
    { label: "Australia (UTC+10:00)", value: "Etc/GMT-10" },
    { label: "Solomon Islands (UTC+11:00)", value: "Etc/GMT-11" },
    { label: "New Zealand (UTC+12:00)", value: "Etc/GMT-12" }
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <h3 className="text-lg font-semibold text-cyan-400">User Details</h3>

      <input
        name="name"
        placeholder="Full Name*"
        value={contact.name}
        onChange={handleChange}
        className="input"
      />
      <input
        name="email"
        placeholder="Email*"
        value={contact.email}
        onChange={handleChange}
        className="input"
      />
      <input
        name="phone"
        placeholder="Phone Number*"
        value={contact.phone}
        onChange={handleChange}
        className="input"
      />

      <select
        name="timezone"
        value={contact.timezone || ""}
        onChange={handleChange}
        className="input"
      >
        <option value="">Select Preferred Timezone</option>
        {timezoneOptions.map((tz) => (
          <option key={tz.value} value={tz.value} className={tz.color || "text-white"}>
            {tz.label}
          </option>
        ))}
      </select>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600">
          Back
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-500">
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwoContactForm;