import { SectionPage } from '@/pages/SectionPage';
import { adminPages } from '@/data/siteData';

export function DashboardPage() {
  return <SectionPage page={adminPages.dashboard} />;
}
