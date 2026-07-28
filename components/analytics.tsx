/**
 * Public-build analytics: none.
 *
 * The private build reports to its own property. Shipping that measurement ID
 * in a repository people clone and deploy would pollute it with traffic from
 * every fork, so this renders nothing.
 */
export function Analytics() {
  return null;
}
