import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import Popup from "@/components/marketing/Popup";
import { getActivePopups } from "@/lib/data/popup";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const popups = await getActivePopups();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {popups.length > 0 && <Popup notices={popups} />}
    </>
  );
}
