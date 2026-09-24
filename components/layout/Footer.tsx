'use client';

interface FooterProps {
  hint?: string;
}

export default function Footer({ hint }: FooterProps) {
  return (
    <footer className="shrink-0 flex flex-col gap-1 border-t border-black/5 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="text-[11px] text-black/40 font-medium">
        © {new Date().getFullYear()} Sesijepret Photo Booth
      </p>

      {hint && (
        <p className="text-center text-[11px] text-black/50 font-medium sm:flex-1 sm:px-4">
          {hint}
        </p>
      )}

      <p className="text-[11px] text-black/40 font-medium">
        Capture Your Moments
      </p>
    </footer>
  );
}
