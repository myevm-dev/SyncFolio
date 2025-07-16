import React from "react";
import { Dialog, DialogContent } from "./Dialog";

interface FlowboardProps {
  open: boolean;
  onClose: () => void;
}

const Flowboard: React.FC<FlowboardProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-zinc-900 border-zinc-700">
        <div className="w-full px-6 py-12 flex justify-center items-center text-zinc-400">
          <p className="text-lg text-center">🧠 Flowboard Placeholder — Coming Soon</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Flowboard;
