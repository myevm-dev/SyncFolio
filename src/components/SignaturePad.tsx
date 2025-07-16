import React, { useState } from "react";

interface Props {
  onSave: (dataUrl: string) => void;
  disabled?: boolean;
}

const SignaturePad: React.FC<Props> = ({ onSave, disabled = false }) => {
  const [typedValue, setTypedValue] = useState("");

  const handleTypedSave = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1e293b"; // dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedValue, canvas.width / 2, canvas.height / 2);

    const dataUrl = canvas.toDataURL("image/png");
    console.log("✍️ Typed signature saved:", dataUrl.length);
    onSave(dataUrl);
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-4 text-center text-blue-400">
        Type Your Signature
      </h2>

      <input
        type="text"
        className="w-full p-2 rounded bg-slate-800 text-white mb-4"
        placeholder="Type your name..."
        value={typedValue}
        onChange={(e) => setTypedValue(e.target.value)}
      />

      <button
        onClick={handleTypedSave}
        disabled={disabled || !typedValue}
        className="px-4 py-2 bg-green-500 rounded text-black w-full font-semibold disabled:opacity-50"
      >
        Save
      </button>
    </>
  );
};

export default SignaturePad;
