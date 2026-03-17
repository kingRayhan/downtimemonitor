import { ConsolePage } from '@/components/console-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/settings')({
  component: () => <ConsolePage pageId="settings" />,
});

