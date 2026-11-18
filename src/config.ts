/**
 * Page switches. Flip these as material comes in after the event.
 */
export const config = {
  /** Set to true once the photos are in; hides the "FOTO VOLGT" labels. */
  photosLive: true,
  /** Set to true once the aftermovie is available. */
  movieLive: true,
  /** Shown while the aftermovie is not live yet. */
  movieDate: "23 november",
  /**
   * Contact form delivery via Web3Forms (https://web3forms.com). Responses go to the
   * inbox the access key was created for. The access key is meant to be public
   * (it can only send to that inbox), so it is fine in the page source.
   */
  form: {
    endpoint: "https://api.web3forms.com/submit",
    /** Delivers to niels@adami.ai, the inbox this key was created for. */
    accessKey: "35b2cb9e-3cdf-4b3f-b373-aaaf5e139b47",
  },
};
