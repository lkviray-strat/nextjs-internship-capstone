type RequiredLabelProps = {
  children: React.ReactNode;
  className?: string;
  turnOff?: boolean;
};

export function RequiredLabel({
  children,
  className,
  turnOff = false,
}: RequiredLabelProps) {
  return (
    <>
      {turnOff ? (
        children
      ) : (
        <>
          {children}
          <span className={`-ml-1 text-red-500 ${className}`}>*</span>
        </>
      )}
    </>
  );
}
