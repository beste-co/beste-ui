/**
 * Cookie consent for visitors in the EU, EEA, UK and Switzerland.
 *
 * Region is read from the browser's time zone: it needs no geo header, works the
 * same on every host, and errs towards asking. Everyone else is not asked and
 * counts as granted.
 */

export type Consent = "granted" | "denied";

export const CONSENT_KEY = "cookie-consent";
export const CONSENT_EVENT = "cookie-consent-change";
export const CONSENT_SETTINGS_HREF = "#cookie-settings";

const REGION_PATTERN =
  "^(Europe\\/|Atlantic\\/(Canary|Madeira|Azores|Reykjavik|Faroe)|Asia\\/(Nicosia|Famagusta)|Africa\\/Ceuta|Arctic\\/Longyearbyen)";

export function needsConsent(): boolean {
  try {
    return new RegExp(REGION_PATTERN).test(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
  } catch {
    return true;
  }
}

export function getStoredConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  const stored = getStoredConsent();
  return stored ? stored === "granted" : !needsConsent();
}

const googleSignals = (consent: Consent) => ({
  ad_storage: consent,
  ad_user_data: consent,
  ad_personalization: consent,
  analytics_storage: consent,
});

export function setConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {}
  window.gtag?.("consent", "update", googleSignals(consent));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}

/**
 * Runs in <head> before the Google tag, so the tag starts from the right state
 * (Consent Mode v2) instead of collecting first and being corrected later.
 */
export const CONSENT_BOOTSTRAP = `(function(){
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
var stored=null;try{stored=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})}catch(e){}
var asked=true;try{asked=new RegExp(${JSON.stringify(REGION_PATTERN)}).test(Intl.DateTimeFormat().resolvedOptions().timeZone||"")}catch(e){}
var state=(stored?stored==="granted":!asked)?"granted":"denied";
window.gtag("consent","default",{ad_storage:state,ad_user_data:state,ad_personalization:state,analytics_storage:state});
})();`;
