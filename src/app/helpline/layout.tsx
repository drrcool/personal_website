import HelplineHeader from "@/components/helpline-components/layout/helpline-header";

export default function HelplineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <div className="flex flex-col gap-0 w-full">
      <HelplineHeader />
      <div className="block m-5 w-full h-full">{children}</div>
    </div>
  );
}
