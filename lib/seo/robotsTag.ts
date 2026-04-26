/**
 * Returns the robots meta content string based on indexability.
 * Used in generateMetadata() for every quality-gated page.
 *
 * 'noindex, follow' — page exists but Google should not index it.
 *   "follow" preserves PageRank flow through internal links even when noindex.
 * 'index, follow' — standard indexable page.
 */
export function robotsContent(indexable: boolean): string {
  return indexable ? 'index, follow' : 'noindex, follow'
}
