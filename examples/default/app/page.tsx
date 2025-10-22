export default function Home() {
  return (
    <div className="font-(family-name:--font-geist-sans) grid grow grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <ol className="font-(family-name:--font-geist-mono) list-inside list-decimal text-center text-sm sm:text-left">
          <li className="mb-2">
            Get started by editing{' '}
            <code className="rounded bg-black/5 px-1 py-0.5 font-semibold dark:bg-white/6">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
      </main>
    </div>
  );
}
