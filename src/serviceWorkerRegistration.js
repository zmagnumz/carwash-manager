const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/)
);

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(reg => {
      reg.onupdatefound = () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.onstatechange = () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] 새 버전이 준비됐습니다. 새로고침하면 업데이트됩니다.');
          }
        };
      };
    })
    .catch(err => console.error('[SW] 등록 실패:', err));
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then(res => {
      if (res.status === 404 || res.headers.get('content-type')?.indexOf('javascript') === -1) {
        navigator.serviceWorker.ready.then(reg => reg.unregister()).then(() => window.location.reload());
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => console.log('[SW] 오프라인 모드'));
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(reg => reg.unregister())
      .catch(err => console.error(err));
  }
}
