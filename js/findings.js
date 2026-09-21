(function () {
  'use strict';

  const WEB_APP_URL =
    'https://script.google.com/macros/s/AKfycbyiyZv0qkjlumwPdwqKOrbqUBTdSFT_4rIvm_9ICZNXPFZ6AYdN49WC3T-P8AKDGlY3kg/exec';

  const responsesEl = document.querySelector('[data-responses]');
  const countriesEl = document.querySelector('[data-countries]');
  const sectorsEl = document.querySelector('[data-sectors]');
  const updatedEl = document.querySelector('[data-updated]');
  const listEl = document.querySelector('[data-finding-list]');

  function safe(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showMessage(message) {
    if (!listEl) return;

    listEl.innerHTML =
      '<div class="legal-row">' +
      '<strong>' + safe(message) + '</strong>' +
      '</div>';
  }

  window.ACSAARTHI_receive = function (data) {

    if (!data || data.ok === false) {
      showMessage('Live data is temporarily unavailable.');
      return;
    }

    if (responsesEl) {
      responsesEl.textContent = data.verifiedResponses || 0;
    }

    if (countriesEl) {
      countriesEl.textContent = data.countriesRepresented || 0;
    }

    if (sectorsEl) {
      sectorsEl.textContent = data.sectorsRepresented || 0;
    }

    if (updatedEl && data.updatedAt) {
      const d = new Date(data.updatedAt);

      updatedEl.textContent = isNaN(d.getTime())
        ? data.updatedAt
        : d.toLocaleString();
    }

    if (data.mode === 'OFF') {
      showMessage(
        'Live publishing is currently switched off.'
      );
      return;
    }

    if (data.mode === 'HOLD') {
      showMessage(
        'Evidence is under review. Verified responses: ' +
        (data.verifiedResponses || 0) +
        ' / minimum public sample: ' +
        (data.minimumResponses || 0)
      );
      return;
    }

    if (!listEl) return;

    const findings = Array.isArray(data.findings)
      ? data.findings
      : [];

    let html = '';

    if (data.mode === 'TEST') {
      html +=
        '<div class="legal-row">' +
        '<strong>TEST MODE</strong>' +
        'Technical verification only — these numbers are not yet public research findings.' +
        '</div>';
    }

    if (!findings.length) {
      html +=
        '<div class="legal-row">' +
        '<strong>No publishable findings yet</strong>' +
        safe(data.note || '') +
        '</div>';

      listEl.innerHTML = html;
      return;
    }

    findings.forEach(function (item) {

      html +=
        '<div class="legal-row">' +
        '<strong>' +
        safe(item.label) +
        '</strong>' +
        safe(item.topOption) +
        ' — ' +
        safe(item.percent) +
        '% (' +
        safe(item.count) +
        ' of ' +
        safe(item.sampleSize) +
        ' verified responses)' +
        '</div>';
    });

    listEl.innerHTML = html;
  };

  const script = document.createElement('script');

  script.src =
    WEB_APP_URL +
    '?callback=ACSAARTHI_receive&_=' +
    Date.now();

  script.async = true;

  script.onerror = function () {
    showMessage('Unable to load live insights at the moment.');
  };

  document.head.appendChild(script);

})();
