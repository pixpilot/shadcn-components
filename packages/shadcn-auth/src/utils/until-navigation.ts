/**
 * A promise that never settles, for the moment after a redirect has been handed
 * to the router.
 *
 * The work succeeded, but this page is on its way out — and a handler that
 * resolves here tells the form the opposite: its submit button stops spinning
 * and its fields unlock for the frame or two before the new page paints, which
 * reads as the click having done nothing. Leaving the promise open holds the
 * form in its submitting state until the navigation takes the page with it.
 *
 * Nothing is leaked: the pending promise dies with the document, and a user who
 * comes back with the Back button gets a restored page whose forms reset
 * themselves on `pageshow`.
 */
export async function untilNavigation(): Promise<never> {
  return new Promise<never>(() => {});
}
