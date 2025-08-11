export const SectionLabel = ({ label }: { label: string }) => {
  return (
    <div className="text-xl text-primary uppercase tracking-widest mb-4 font-medium">
      {label}
    </div>
  );
};

export const SectionComponent = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <section id={label} className="py-6 pb-4 border-b border-gray-800">
      <SectionLabel label={label} />
      {children}
    </section>
  );
};
