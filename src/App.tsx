import CashOnCashCalculator from "./components/CashOnCashCalculator";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      <div className="flex-grow">
        <CashOnCashCalculator />
      </div>
      <Footer />
    </div>
  );
}
