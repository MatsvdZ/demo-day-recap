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
   * Contact form delivery via Web3Forms (https://web3forms.com). Responses go to the
   * inbox the access key was created for. The access key is meant to be public
   * (it can only send to that inbox), so it is fine in the page source.
   */
  form: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "2887f06e-ade7-424f-9cf7-3e71588307e8",
  },
};
