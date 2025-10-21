import ServicesGuard from '@/components/auth/ServicesGuard';

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServicesGuard>{children}</ServicesGuard>;
}
