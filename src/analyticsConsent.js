export function getAnalyticsCategory() {
  return {
    autoClear: {
      cookies: [
        { name: /^_ga/ },
        { name: /^_gid$/ },
        { name: /^_gat/ },
        { name: "_gcl_au" },
        { name: /^_dc_gtm_/ },
        { name: /^_gac_/ },
      ],
      reloadPage: true,
    },
    services: {
      google_tag_manager: {
        label: "Google Tag Manager",
      },
    },
  };
}
