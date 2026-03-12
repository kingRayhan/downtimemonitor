import type { ConsolePageId } from "@/config/console-pages"
import { consolePages } from "@/config/console-pages"

interface ConsolePageProps {
  pageId: ConsolePageId
}

export function ConsolePage({ pageId }: ConsolePageProps) {
  const page = consolePages[pageId]

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{page.title}</h1>
        {page.description ? (
          <p className="text-sm text-muted-foreground">{page.description}</p>
        ) : null}
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {page.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border bg-card p-4 text-sm"
          >
            <h2 className="text-sm font-medium">{section.title}</h2>
            {section.description ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {section.description}
              </p>
            ) : null}
            {section.items && section.items.length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}
