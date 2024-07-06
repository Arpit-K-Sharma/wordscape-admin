import Image from "next/image";
import Vendors from "./components/Vendors/vendors";
import Dashboard from "./components/Dashboard/Dashboard";

export default function Home() {
  return (
    <main>
      <Dashboard />
      {/* <Vendors /> */}
    </main>
  );
}
