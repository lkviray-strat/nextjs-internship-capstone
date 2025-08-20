type RequiredLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function RequiredLabel({ children, className }: RequiredLabelProps) {
  return (
    <>
      {children}
      <span className={`-ml-1 text-red-500 ${className}`}>*</span>
    </>
  );
}
