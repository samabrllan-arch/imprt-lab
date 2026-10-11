/**
 * Vista #conocenos del enrutador (NODE-013 / NODE-028): abre y cierra "Conócenos" a pantalla completa,
 * con el mismo patrón que appRouterGallery.js. Reciben el `AppRouter` para mantenerlo bajo 250 líneas.
 */
const root = () => document.documentElement;

export function openAbout(router, pushHash = true) {
  if (router.isAboutOpen) return;
  if (router.isStudioOpen) router.closeStudio(false);
  if (router.isAuthOpen) router.closeAuth(false);
  if (router.isGalleryOpen) router.closeGallery(false);
  router.isAboutOpen = true;
  router.landingScrollY = window.scrollY; // para volver a la misma posición de la tienda

  root().classList.add('route-about');
  root().classList.remove('route-studio', 'route-auth', 'route-gallery');
  try {
    sessionStorage.setItem('shirt_current_view', 'about');
    sessionStorage.removeItem('shirt_auth_tab');
  } catch (_) {}
  if (pushHash && window.location.hash.toLowerCase() !== '#conocenos') history.pushState(null, '', '#conocenos');

  router.aboutController?.open();
  if (router.landingView) router.landingView.style.display = 'none';
  if (router.aboutView) {
    router.aboutView.style.display = 'flex';
    router.aboutView.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}

export function closeAbout(router, updateHash = true) {
  if (!router.isAboutOpen) return;
  router.isAboutOpen = false;

  root().classList.remove('route-about');
  try { sessionStorage.removeItem('shirt_current_view'); } catch (_) {}
  if (updateHash) history.pushState(null, '', window.location.pathname);

  router.aboutController?.close();
  if (router.aboutView) router.aboutView.style.display = 'none';
  if (!router.isStudioOpen && !router.isAuthOpen && !router.isGalleryOpen && router.landingView) {
    router.landingView.style.display = 'block';
    window.scrollTo(0, router.landingScrollY || 0);
  }
  window.dispatchEvent(new Event('resize'));
}
