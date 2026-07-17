"use client"

import styles from "./cv.module.css"

/**
 * Screen-only floating control. The Download PDF button opens the browser's own
 * print / save dialog; choosing "Save as PDF" keeps the text and links live and
 * preserves the two-page layout. Hidden entirely in print.
 */
export function Toolbar() {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Page actions">
      <span className={styles.toolbarHint}>Two-page A4 · print-ready</span>
      <button
        type="button"
        className={styles.printBtn}
        onClick={() => window.print()}
      >
        Download PDF
      </button>
    </div>
  )
}
