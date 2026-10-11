/**
 * Disparadores de vistas del enrutador (NODE-013): un único listener de clic delegado en `document` que abre
 * Estudio, Galería, Conócenos o Auth según `data-action` o el `href` hash del enlace pulsado.
 * Vive aparte de appRouter.js para mantenerlo bajo 250 líneas.
 * @param {import('./appRouter.js').AppRouter} router
 */
export function bindViewTriggers(router) {
  document.addEventListener('click', (e) => {
    const studioTrigger = e.target.closest('[data-action="open-studio"], a[href="#estudio"], a[href="#disenar"]');
    if (studioTrigger && !studioTrigger.getAttribute('href')?.includes('studio.html') && studioTrigger.getAttribute('target') !== '_blank') {
      e.preventDefault();
      router.openStudio();
      return;
    }

    if (e.target.closest('[data-action="open-gallery"], a[href="#galeria"]')) {
      e.preventDefault();
      router.openGallery();
      return;
    }

    if (e.target.closest('[data-action="open-about"], a[href="#conocenos"], a[href="#nosotros"]')) {
      e.preventDefault();
      router.openAbout();
      return;
    }

    const authTrigger = e.target.closest('[data-action="open-auth"], a[href="#cuenta"], a[href="#login"], a[href="#registro"]');
    if (authTrigger) {
      e.preventDefault();
      router.openAuth(authTrigger.getAttribute('data-tab') || 'login');
    }
  });
}
