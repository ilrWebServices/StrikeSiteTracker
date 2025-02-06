(function(document) {

  document.addEventListener('DOMContentLoaded', async (event) => {
    const page_name = (() => {
      switch (location.pathname) {
        case '/about.html':
          return 'About Us';
        case '/methodology.html':
          return 'Methodology';
        case '/suggested-citation.html':
          return 'Suggested Citation Format';
        default:
          return 'Labor Action Tracker';
      }
    })();
    const header = document.querySelector('header');
    const navbar = createElementFromTemplate(renderNavbar(page_name));
    header.appendChild(navbar);
  });

  const renderNavbar = (page_title = 'Labor Action Tracker') => {
    return `<div class="bottomNav">
      <div class="titleSection">
        <h1 class="websiteTitle">${page_title}</h1>
      </div>
      <div class="linksSection">
        <a href="/" class="navLinks">Home</a>
        <a href="/about.html" class="navLinks">About Us</a>
        <a href="/methodology.html" class="navLinks">Methodology</a>
        <a href="https://www.ilr.cornell.edu/faculty-and-research/labor-action-tracker" class="navLinks">Reports</a>
        <a href="https://sheets.app.ilr.cornell.edu/o/docs/forms/rsqHwVCgH1vz7yqTauVXxw/21" class="navLinks">Report a
          Strike</a>
        <a href="/suggested-citation.html" class="navLinks">How to cite</a>
        <a class="follow-button" title="Follow @ILRLaborAction on Twitter"
          href="https://twitter.com/intent/follow?ref_src=twsrc%5Etfw&amp;region=follow_link&amp;screen_name=ILRLaborAction&amp;tw_p=followbutton"><img
            src="assets/twitter-x.svg" alt="Follow @ILRLaborAction on Twitter"></a>
        <a class="follow-button" title="Follow @laboraction.bsky.social on Bluesky"
          href="https://bsky.app/profile/laboraction.bsky.social"><img src="assets/Bluesky_Logo.svg"
            alt="Follow @laboraction.bsky.social on Bluesky"></a>
      </div>
    </div>`;
  };

  const createElementFromTemplate = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

})(document);
