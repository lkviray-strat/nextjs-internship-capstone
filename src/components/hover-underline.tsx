export function HoverUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative group cursor-pointer py-1">
      {children}
      <span
        className="absolute bottom-0 left-0 h-[3px] bg-primary w-full
                   origin-left scale-x-0 transition-transform duration-300
                   group-hover:scale-x-100"
      />
    </span>
  );
}
