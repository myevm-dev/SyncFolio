import { useNavigate } from "react-router-dom";

export default function TurfwarsCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/turfwars")}
      className="cursor-pointer bg-black border border-cyan-500 hover:border-cyan-400 transition-all duration-200 shadow-xl rounded-xl h-48 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-center">
        GO TO TURFWARS
      </h2>
    </div>
  );
}
