import {
  Award,
  BadgeCheck,
  Banknote,
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CreditCard,
  FileText,
  Fingerprint,
  Gauge,
  Gift,
  HandCoins,
  Headset,
  HelpCircle,
  Info,
  Landmark,
  Languages,
  Laptop,
  LineChart,
  Lock,
  LogIn,
  MapPin,
  Palette,
  Percent,
  Phone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Small green glyph layered over the main icon. */
  accent?: LucideIcon;
  /** Rendered as a switch instead of a chevron row. */
  toggle?: { defaultOn: boolean };
};

export type MenuSectionConfig = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const APP_NAME = "Belpatri";
export const APP_VERSION = "4.9.1.2 (624)";

export const menuSections: MenuSectionConfig[] = [
  {
    id: "accounts",
    title: "My Accounts",
    items: [
      {
        id: "kyc",
        title: "KYC & PAN / VAT Verification",
        subtitle: "Update your KYC details",
        icon: CreditCard,
        accent: BadgeCheck,
      },
      {
        id: "business",
        title: "Business Accounts",
        subtitle: "View your associated business accounts",
        icon: Landmark,
        accent: HandCoins,
      },
      {
        id: "calendar",
        title: "Trade Calendar",
        subtitle: "Dispatch, weighing and settlement dates in one place",
        icon: CalendarDays,
        accent: CalendarCheck,
      },
      {
        id: "limits",
        title: "Transaction Limits",
        subtitle: "View your escrow and payout limits",
        icon: Gauge,
        accent: Percent,
      },
      {
        id: "devices",
        title: "Devices & Credentials",
        subtitle: "Manage your devices, credentials & alert IDs",
        icon: Laptop,
        accent: Smartphone,
      },
      {
        id: "finance360",
        title: "Finance360",
        subtitle: `Manage your trade finances with ${APP_NAME}`,
        icon: LineChart,
        accent: TrendingUp,
      },
      {
        id: "bank",
        title: "Bank Accounts",
        subtitle: "Manage your saved and linked escrow accounts",
        icon: Banknote,
        accent: Landmark,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    items: [
      {
        id: "appearance",
        title: "Appearance",
        subtitle: "Choose your preferred theme",
        icon: Palette,
      },
      {
        id: "language",
        title: "Language",
        subtitle: "Choose your preferred language",
        icon: Languages,
      },
      {
        id: "notifications",
        title: "Notifications",
        subtitle: "Your wallet and trade activity alerts",
        icon: Bell,
      },
    ],
  },
  {
    id: "permission",
    title: "Permission",
    items: [
      {
        id: "schedule-payment",
        title: "Schedule Payment",
        subtitle: "Schedule vendor payouts in advance",
        icon: CalendarClock,
        toggle: { defaultOn: false },
      },
      {
        id: "request-money",
        title: "Request Money",
        subtitle: "Enable payment requests from buyers",
        icon: HandCoins,
        toggle: { defaultOn: true },
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      {
        id: "mpin",
        title: "Change MPIN",
        subtitle: "Change your MPIN",
        icon: Smartphone,
        accent: Lock,
      },
      {
        id: "biometric",
        title: "Use Biometric",
        subtitle: "Set biometrics for login, payment, or both",
        icon: Fingerprint,
      },
    ],
  },
  {
    id: "help",
    title: "Help & FAQs",
    items: [
      {
        id: "support",
        title: "Customer Support",
        subtitle: "Raise a ticket or view progress of your tickets",
        icon: Headset,
        accent: Phone,
      },
      {
        id: "faqs",
        title: "Help & FAQs",
        subtitle: "FAQs regarding all generic queries",
        icon: HelpCircle,
      },
      {
        id: "tariffs",
        title: `${APP_NAME} Tariffs`,
        subtitle: "View the tariffs levied in all applicable services",
        icon: FileText,
        accent: Percent,
      },
      {
        id: "cashpoint",
        title: "Weighbridge & Collection Points",
        subtitle: "Find collection points and weighbridges near you",
        icon: MapPin,
      },
    ],
  },
  {
    id: "offers",
    title: "Offers & Campaigns",
    items: [
      {
        id: "promocodes",
        title: "Offers & Promocodes",
        subtitle: "View all offers & available promocodes",
        icon: Gift,
      },
      {
        id: "rewards",
        title: "Rewards",
        subtitle: "View all rewards you've earned",
        icon: Award,
        accent: Star,
      },
    ],
  },
  {
    id: "about",
    title: "About",
    items: [
      {
        id: "contact",
        title: "Contact Us",
        subtitle: "Have any queries? Contact us",
        icon: Phone,
        accent: Headset,
      },
      {
        id: "about-us",
        title: "About Us",
        subtitle: `Know about ${APP_NAME}`,
        icon: Info,
      },
      {
        id: "update",
        title: "Check for update",
        subtitle: `Version: ${APP_VERSION}`,
        icon: RefreshCw,
      },
    ],
  },
];

export const loginItem: MenuItem = {
  id: "login",
  title: "Sign in to Belpatri",
  subtitle: "Continue with Google, or register as a vendor or farmer",
  icon: LogIn,
  accent: ShieldCheck,
};
