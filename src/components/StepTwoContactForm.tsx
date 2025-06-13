// StepTwoContactForm.tsx
import React from "react";

interface Props {
  contact: { name: string; email: string; phone: string };
  setContact: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string }>>;
  onNext: () => void;
  onBack: () => void;
}

const StepTwoContactForm: React.FC<Props> = ({ contact, setContact, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

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
