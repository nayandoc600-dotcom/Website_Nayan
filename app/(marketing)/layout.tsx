import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import Popup from "@/components/marketing/Popup";
import { getActivePopup } from "@/lib/data/popup";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const popup = await getActivePopup();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {popup && <Popup notice={popup} />}
    </>
  );
}
