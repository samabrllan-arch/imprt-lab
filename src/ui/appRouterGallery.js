/**
 * Vista #galeria del enrutador (NODE-013 / NODE-014): abre y cierra la Galería completa a pantalla completa,
 * con el mismo patrón que #estudio y #login. Funciones que reciben el `AppRouter` para mantenerlo bajo 250 líneas.
 */
const root = () => document.documentElement;

export function openGallery(router, pushHash = true) {
  if (router.isGalleryOpen) return;
  if (router.isStudioOpen) router.closeStudio(false);
  if (router.isAuthOpen) router.closeAuth(false);
  if (router.isAboutOpen) router.closeAbout(false);
  router.isGalleryOpen = true;
  router.landingScrollY = window.scrollY; // para volver a la misma posición de la tienda

  root().classList.add('route-gallery');
  root().classList.remove('route-studio', 'route-auth', 'route-about');
  try {
    sessionStorage.setItem('shirt_current_view', 'gallery');
    sessionStorage.removeItem('shirt_auth_tab');
  } catch (_) {}
  if (pushHash && window.location.hash.toLowerCase() !== '#galeria') history.pushState(null, '', '#galeria');

  router.galleryController?.open();
  if (router.landingView) router.landingView.style.display = 'none';
  if (router.galleryView) {
    router.galleryView.style.display = 'flex';
    router.galleryView.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}

export function closeGallery(router, updateHash = true) {
  if (!router.isGalleryOpen) return;
  router.isGalleryOpen = false;

  root().classList.remove('route-gallery');
  try { sessionStorage.removeItem('shirt_current_view'); } catch (_) {}
  if (updateHash) history.pushState(null, '', window.location.pathname);

  router.galleryController?.close();
  if (router.galleryView) router.galleryView.style.display = 'none';
  if (!router.isStudioOpen && !router.isAuthOpen && router.landingView) {
    router.landingView.style.display = 'block';
    window.scrollTo(0, router.landingScrollY || 0);
  }
  window.dispatchEvent(new Event('resize'));
}
