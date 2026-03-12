import { ConsolePage } from '@/components/console-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$workspaceId/logs')({
  component: () => <ConsolePage pageId="logs" />,
});

