import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface Props {
  onSave: (dataUrl: string) => void;
}

const SignaturePad: React.FC<Props> = ({ onSave }) => {
  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleClear = () => sigPadRef.current?.clear();
  const handleSave = () => {
    const dataUrl = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) onSave(dataUrl);
  };

  return (
    <div className="bg-white p-4 rounded">
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 200,
          className: "border border-gray-300 rounded"
        }}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={handleClear} className="px-3 py-1 bg-red-500 text-white rounded">
          Clear
        </button>
        <button onClick={handleSave} className="px-3 py-1 bg-green-500 text-white rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
