/**
 * Page switches. Flip these as material comes in after the event.
 */
export const config = {
  /** Set to true once the photos are in; hides the "FOTO VOLGT" labels. */
  photosLive: false,
  /** Set to true once the aftermovie is available. */
  movieLive: false,
  /** Shown while the aftermovie is not live yet. */
  movieDate: "23 november",
  /**
   * Where the contact form posts (FormSubmit, https://formsubmit.co). Responses are
   * emailed to the address at the end. The first submission triggers a one-time
   * activation email to that address; after activating, FormSubmit offers a random
   * alias you can put here instead so the address isn't visible in the page source.
   */
  formEndpoint: "https://formsubmit.co/ajax/mats.vanderzwan@adami.ai",
};
