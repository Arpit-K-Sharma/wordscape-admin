import Image from "next/image";
import Vendors from "./components/Vendors/vendors";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminLogin from "./_auth/login";

export default function Home() {
  return (
    <main>
      {/* <Dashboard /> */}
      <AdminLogin />
      {/* <Vendors /> */}
    </main>
  );
}
