export function BackgroundGlow() {
  return (
    <div
      className="absolute inset-0 -z-50 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[70rem] h-[12rem] bg-[radial-gradient(ellipse_at_center,var(--primary),transparent_70%)] blur-3xl rotate-[8deg]" />

      <div
        className="absolute top-40 -right-100
                      w-[120rem] h-[8rem]
                      bg-[radial-gradient(ellipse_at_center,var(--primary),transparent_70%)]
                      blur-3xl opacity-60 rotate-[20deg]"
      />

      <div className="absolute -bottom-110 -left-30 w-[35rem] h-[35rem] bg-[radial-gradient(ellipse_at_center,var(--primary),transparent_70%)] opacity-40 blur-3xl" />

      <div className="absolute top-1/2 left-1/2 w-[50rem] h-[50rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--muted),transparent_70%)] opacity-40 blur-3xl" />
      <div
        className="absolute top-100 right-0
                      w-[80rem] h-[8rem]
                      bg-[radial-gradient(ellipse_at_center,var(--primary),transparent_70%)]
                      blur-3xl opacity-50 rotate-[40deg]"
      />
    </div>
  );
}
