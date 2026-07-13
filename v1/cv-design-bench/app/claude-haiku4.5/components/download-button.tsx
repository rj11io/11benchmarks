"use client"

export function DownloadButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-hidden px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors whitespace-nowrap mt-1"
    >
      Download PDF
    </button>
  )
}
