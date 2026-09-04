"use client";

export function AcademicProfileActions() {
  return (
    <div className="academic-actions no-print">
      <a className="btn btn--primary" href="/documents/adossi-fred-william-academic-resume.pdf" download>
        Download academic résumé
      </a>
      <a
        className="btn btn--ghost"
        href="/documents/adossi-fred-william-unofficial-transcript.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        View unofficial transcript
      </a>
      <button className="btn btn--ghost" type="button" onClick={() => window.print()}>
        Print this profile
      </button>
    </div>
  );
}
