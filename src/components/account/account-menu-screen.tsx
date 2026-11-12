"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { LoginFlow } from "@/components/account/login-flow";
import { MenuSection } from "@/components/account/menu-section";
import { LogoutTile, MenuTile } from "@/components/account/menu-tile";
import {
  APP_NAME,
  APP_VERSION,
  loginItem,
  menuSections,
  type MenuItem,
} from "@/components/account/menu-items";
import { ProfileHeaderCard } from "@/components/account/profile-header-card";

function Divider() {
  return <div aria-hidden className="h-2 w-full bg-slate-200/80" />;
}

export function AccountMenuScreen({
  name,
  company,
  phone,
  traderId,
  licence,
  avatar,
}: {
  name: string;
  company: string;
  phone: string;
  traderId: string;
  licence: string;
  avatar: string;
}) {
  const router = useRouter();
  const [verified] = useState(true);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      menuSections.flatMap((section) =>
        section.items.flatMap((item) =>
          item.toggle ? [[item.id, item.toggle.defaultOn]] : [],
        ),
      ),
    ),
  );

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const handleItem = (item: MenuItem) => {
    if (item.id === "update") {
      toast.success("You're on the latest version", {
        description: `Installed version: ${APP_VERSION}`,
      });
      return;
    }

    toast(item.title, {
      description: "This section is not part of the prototype yet.",
    });
  };

  return (
    <div className="-mb-20 bg-slate-50 md:mb-0 md:bg-transparent">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b border-slate-200 bg-white px-2 md:hidden">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="flex size-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-[18px] font-semibold text-slate-900">Account</span>
      </header>

      <div className="mx-auto w-full max-w-md pb-8 md:max-w-2xl md:pb-12">
        <div className="hidden px-4 pt-6 md:block">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Account
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Profile, business accounts and preferences for your {APP_NAME}{" "}
            trader account.
          </p>
        </div>

        <div className="px-4 pt-4 md:pt-6">
          <ProfileHeaderCard
            name={name}
            company={company}
            phone={phone}
            traderId={traderId}
            licence={licence}
            avatar={avatar}
            verified={verified}
            onUpdateKyc={() =>
              toast("KYC update", {
                description: "Document upload is not available in the prototype.",
              })
            }
            onLinkBusiness={() =>
              toast("Link business account", {
                description: "Add another registered business to this login.",
              })
            }
          />
        </div>

        {menuSections.map((section) => (
          <Fragment key={section.id}>
            <div className="mt-4">
              <Divider />
            </div>
            <div className="px-4 py-5">
              <MenuSection title={section.title}>
                {section.items.map((item) => (
                  <MenuTile
                    key={item.id}
                    item={item}
                    onTap={() => handleItem(item)}
                    toggle={
                      item.toggle
                        ? {
                            checked: toggles[item.id] ?? item.toggle.defaultOn,
                            onChange: (next) =>
                              setToggles((current) => ({
                                ...current,
                                [item.id]: next,
                              })),
                          }
                        : undefined
                    }
                  />
                ))}

                {section.id === "about" ? (
                  <MenuTile
                    item={loginItem}
                    trailing={<LoginFlow className="h-8 rounded-lg px-3 text-[11px]" />}
                  />
                ) : null}
              </MenuSection>
            </div>
          </Fragment>
        ))}

        <Divider />

        <div className="px-4 py-5">
          <LogoutTile
            onTap={() =>
              toast("Logged out", {
                description: "Demo only — no session or cart data was cleared.",
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
