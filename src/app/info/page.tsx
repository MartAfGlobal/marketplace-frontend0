import { Metadata } from "next";
import AfricaToTheWorldClient from "./AfricaToTheWorldClient";

export const metadata: Metadata = {
  title: "Africa to the World | Martaf",
  description: "The home of African-made and discovered treasures. Bridging the gap between the continent's finest creators and global discovery.",
};

export default function Page() {
  return <AfricaToTheWorldClient />;
}
