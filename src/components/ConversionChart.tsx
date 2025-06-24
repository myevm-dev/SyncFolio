import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const statuses = ["called", "contacted", "offer sent", "contract sent", "closed"];

export default function ConversionChart({ walletAddress }: { walletAddress: string }) {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetch = async () => {
      const snap = await getDocs(collection(db, `users/${walletAddress}/deals`));
      const allDeals = snap.docs.map((doc) => doc.data().status);

      const counts = statuses.map((status, index) => {
        const includedStatuses = statuses.slice(index);
        return allDeals.filter((s) => includedStatuses.includes(s)).length;
      });

      setData(counts);
    };

    fetch();
  }, [walletAddress]);

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-white">Conversion Breakdown</h3>
      <Bar
        data={{
          labels: statuses,
          datasets: [
            {
              label: "Deals",
              data,
              backgroundColor: "#6e5690",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "white",
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "white" },
              grid: { color: "rgba(255,255,255,0.1)" },
            },
            y: {
              beginAtZero: true,
              ticks: { color: "white" },
              grid: { color: "rgba(255,255,255,0.1)" },
            },
          },
        }}
      />
    </div>
  );
}
