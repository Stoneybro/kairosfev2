import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    value: "item-1",
    question: "What is Kairos?",
    answer: [
      "Kairos is a smart wallet system that enforces accountability through financial stakes and automated rules.",
    ],
  },
  {
    value: "item-2",
    question: "How does it work?",
    answer: [
      "You commit funds to a task or goal. If you succeed, you keep or earn them.",
      "If you fail, penalties trigger automatically.",
    ],
  },
  {
    value: "item-3",
    question: "Do I need crypto knowledge to use it?",
    answer: [
      "No. You sign up with social login, and your smart wallet is deployed in seconds.",
      "No seed phrases, no complexity—just a smooth onboarding flow.",
    ],
  },
  {
    value: "item-4",
    question: "Can I log in with Google or Apple?",
    answer: [
      "Yes. Kairos supports social logins like Google, Apple, and email.",
      "It feels like a normal app, but your account is on-chain.",
    ],
  },
  {
    value: "item-5",
    question: "What about transaction fees?",
    answer: [
      "Transactions are sponsored in the background.",
      "In most cases you won’t see or pay gas fees directly.",
    ],
  },
  {
    value: "item-6",
    question: "What makes Kairos different from other accountability apps?",
    answer: [
      "Traditional apps rely on trust or referees.",
      "Kairos uses on-chain enforcement. Rules execute automatically, no middlemen.",
    ],
  },
  {
    value: "item-7",
    question: "Can I use Kairos with a partner?",
    answer: [
      "No. Only manual verification of tasks is available currently, but partner verification feature would be released soon",
    ],
  },
  {
    value: "item-8",
    question: "Is my money safe?",
    answer: [
      "Yes. Funds are secured by ERC-4337 smart accounts on-chain.",
      "You control your wallet, and every transaction is auditable.",
    ],
  },
  {
    value: "item-9",
    question: "What blockchains does Kairos run on?",
    answer: [
      "Kairos launches on Base (Ethereum L2) with account abstraction support.",
      "Expansion to other chains is planned.",
    ],
  },
];

export function Faq() {
  return (
    <>
      <div className='h-full w-full flex justify-center items-center text-5xl py-16 px-6'>
        <h4>FAQ</h4>
      </div>
      <div className=" max-w-2xl mx-auto px-6">

              <Accordion
        type='single'
        collapsible
        className='w-full'
        defaultValue='item-1'
      >
        {faqData.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-lg">{question}</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              {answer.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </div>

    </>
  );
}
