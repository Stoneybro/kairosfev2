import React from "react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";

// Section heading metadata
const heading = {
  tag: "FEATURES",
  title: "Accountability on-chain.",
  subtitle:
    "A user-friendly smart wallet that makes commitments auditable and self-executing.",
};

// Feature cards data: each card has an image, description, and key traits
const featuresCardsList = {
  items: [
    {
      _title: "Smart Wallets (ERC-4337)",
      description:
        "Deploy a SimpleAccount that secures your funds and enforces task rules. Built-in logic handles commitments without middlemen.",
      image: {
        src: "/smartwallet.png",
        alt: "Illustration of a smart wallet",
      },
      characteristics: {
        items: [
          { _title: "One-click deployment" },
          { _title: "Gasless onboarding and transactions" },
          { _title: "Verifiable, on-chain transaction history" },
        ],
      },
    },
    {
      _title: "Task Accountability",
      description:
        "Commit funds to a task. Funds remain until completion or until contract rules trigger penalties or rewards.",
      image: {
        src: "/lockedwallet.png",
        alt: "Locked funds and task card",
      },
      characteristics: {
        items: [
          { _title: "Secure funds" },
          { _title: "Time-bound tasks" },
          { _title: "Configurable penalty rules" },
        ],
      },
    },
    {
      _title: "Automated Enforcement",
      description:
        "Smart contracts execute payouts or penalties automatically after verification. No manual intervention required.",
      image: {
        src: "/Automation.png",
        alt: "Automation and verification flow",
      },
      characteristics: {
        items: [
          { _title: "No referees or middlemen" },
          { _title: "Pre-set rules you can’t bypass" },
          { _title: "Self-executing payouts and penalties" },
        ],
      },
    },
  ],
};

function Features() {
  return (
    <div className="w-full h-full px-8">
      <section className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="h-full w-full flex justify-center items-center text-5xl py-16">
          <h4>{heading.tag}</h4>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-6">
          {featuresCardsList.items.map(({ image, ...item }) => (
            <article
              key={item._title}
              className="flex min-h-96 w-full max-w-[380px] flex-col rounded border bg-muted sm:max-w-full md:w-full md:flex-row md:odd:flex-row-reverse xl:gap-16"
            >
              {/* Feature image */}
              <figure className="p-2 md:h-auto md:w-[360px] lg:w-[480px] xl:w-[560px] rounded bg-muted">
                <Image
                  {...image}
                  className="block aspect-video h-[200px] w-full rounded-lg border object-cover md:h-full"
                  height={374}
                  width={560}
                />
              </figure>

              {/* Feature text */}
              <div className="flex flex-col gap-8 p-5 pt-6 md:flex-1 md:p-10">
                <div className="flex flex-col items-start gap-2">
                  <h5 className="text-2xl font-medium md:text-3xl">
                    {item._title}
                  </h5>
                  <p className="font-normal md:text-lg">{item.description}</p>
                </div>

                {/* Characteristics list */}
                <ul className="flex flex-col items-start gap-3 pl-2 md:text-lg">
                  {item.characteristics.items.map(({ _title }) => (
                    <li key={_title} className="flex items-center gap-4">
                      <span className="flex size-6 items-center justify-center rounded-full bg-foreground/10">
                        <CheckIcon className="w-4" />
                      </span>
                      {_title}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Features;
