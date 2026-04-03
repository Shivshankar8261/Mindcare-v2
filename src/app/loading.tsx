export default function RootLoading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
        <div className="inline-flex h-10 w-10 rounded-full border-2 border-teal/40 border-t-teal animate-spin" />
        <div>
          <div className="text-sm text-muted">MindCare</div>
          <div className="mt-1 font-display text-xl tracking-tight text-foreground">
            Loading…
          </div>
        </div>
        <p className="text-sm text-muted">Preparing your workspace.</p>
      </div>
    </main>
  );
}
