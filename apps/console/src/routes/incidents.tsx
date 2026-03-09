import { ConsolePage } from '@/components/console-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/incidents')({
  component: () => <ConsolePage pageId="incidents" />,
});

