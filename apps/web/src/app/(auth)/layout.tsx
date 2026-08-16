/** Auth routes render standalone — no sidebar, no top bar. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <div className="min-h-dvh bg-bg">{children}</div>;
}
