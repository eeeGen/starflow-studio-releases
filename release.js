(() => {
  const rail = document.querySelector('.version-rail');
  if (!rail) return;

  const links = [...rail.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
  if (sections.some((section) => !section)) return;

  let activeId = '';
  let scheduled = false;

  function setActive(section) {
    if (section.id === activeId) return;
    activeId = section.id;
    let activeLink;

    for (const link of links) {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('rail-current', active);
      if (active) {
        link.setAttribute('aria-current', 'location');
        activeLink = link;
      } else {
        link.removeAttribute('aria-current');
      }
    }

    if (window.matchMedia('(max-width: 760px)').matches && activeLink) {
      const railBox = rail.getBoundingClientRect();
      const linkBox = activeLink.getBoundingClientRect();
      rail.scrollTo({
        left: rail.scrollLeft + linkBox.left - railBox.left - (rail.clientWidth - linkBox.width) / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  }

  function updateActive() {
    scheduled = false;
    const readingLine = Math.max(140, window.innerHeight * 0.28);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top > readingLine) break;
      current = section;
    }
    setActive(current);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateActive);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  scheduleUpdate();
})();
