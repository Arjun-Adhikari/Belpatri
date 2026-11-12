import type { Metadata } from "next";

import { AccountMenuScreen } from "@/components/account/account-menu-screen";
import { account } from "@/lib/data";

export const metadata: Metadata = {
  title: "Account — Belpatri",
  description:
    "KYC, business accounts, trade limits, security and support for your Belpatri trader profile.",
};

const CONTACT_PHONE = "+977 9841 234 567";

export default function AccountPage() {
  return (
    <AccountMenuScreen
      name={account.name}
      company={account.company}
      phone={CONTACT_PHONE}
      traderId={account.traderId}
      licence={account.license}
      avatar={account.avatar}
    />
  );
}
