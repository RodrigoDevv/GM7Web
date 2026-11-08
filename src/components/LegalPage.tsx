import React from 'react';
import { useTheme } from '../context/ThemeContext';

type LegalDocument = 'privacy' | 'terms' | 'cookies';

const DOCUMENTS: Record<LegalDocument, { title: string; sections: Array<{ title: string; body: string[] }> }> = {
  privacy: {
    title: 'Privacy policy',
    sections: [
      { title: 'Who operates this site', body: ['Operator: [LEGAL NAME]. Contact: [CONTACT EMAIL]. Address: [POSTAL ADDRESS]. This draft is based on the current application code and must be completed and reviewed before launch.'] },
      { title: 'Information the site processes', body: ['When you sign in with Discord, GM7 requests your Discord account identity. The app stores your Discord user ID, display name, username, avatar identifier, and an internal account ID in its server-side user store. The current sign-in flow does not request your email address.', 'The site records aggregate daily visits, page views, and page names for the dashboard. Each public app load counts as a visit; refreshing counts again. The analytics file contains daily totals only, with no visitor IDs or IP addresses. Aggregate-stat retention is [ANALYTICS RETENTION PERIOD]. [HOST REQUEST LOGGING AND RETENTION] must be confirmed with the hosting provider.', 'The site sets a short-lived Discord sign-in state cookie and, after sign-in, a 30-day session cookie. Dashboard administrators can also receive a 30-day dashboard session cookie.', 'Tournament registration currently asks for a player or captain name, Discord username, and optional squad name. The values are displayed in the page and are not submitted to or stored by the GM7 server. Continuing opens the GM7 Discord invite.', 'The site stores your light/dark theme choice in browser local storage. It also stores your choice about optional external content in browser local storage.'] },
      { title: 'External services and content', body: ['Google Fonts and embedded Kick player or chat content are blocked until you accept optional content. Rejecting leaves those resources unloaded. You can also load an individual Kick player or chat by using its allow button.', 'The server requests public media and channel information from YouTube, Kick, TikTok, and Instagram. When an administrator uses link auto-fill, the pasted URL is requested by the GM7 server from the supported provider. Instagram images are fetched through a GM7 image proxy. Signing in with Discord sends the OAuth authorization request to Discord; Discord also serves account avatar images.', 'The app records aggregate first-party visit and page-view counts. No third-party analytics or advertising pixel was found in the repository. This statement does not cover hosting-provider logs or services configured outside the repository. Each external service handles data under its own terms and privacy information.'] },
      { title: 'Retention and your choices', body: ['Account records remain in the GM7 server-side user store until the user deletes the account. No account expiry or scheduled deletion was found in the application code. The code sets session cookies for up to 30 days and OAuth state cookies for up to 10 minutes. Server backup retention is [BACKUP RETENTION PERIOD].', 'A signed-in user can use Delete account in the account menu to delete the GM7 account record and clear the GM7 session. For help, contact [CONTACT EMAIL]. This deletion does not delete the user’s Discord account.'] },
      { title: 'Children', body: ['The signup flow currently has no age check. The intended minimum age is [MINIMUM AGE]. The operator must decide whether minors can use the service and what parental consent process applies before enabling account creation.'] },
      { title: 'Markets and effective date', body: ['This draft does not identify the operator’s countries of operation or applicable privacy rights. Complete this section for [COUNTRIES / REGIONS] with legal advice. Effective date: [EFFECTIVE DATE].'] },
    ],
  },
  terms: {
    title: 'Terms of service',
    sections: [
      { title: 'Draft status and operator', body: ['DRAFT — NOT EFFECTIVE. Operator: [LEGAL NAME]. Contact: [CONTACT EMAIL]. Address: [POSTAL ADDRESS]. These terms must be reviewed and completed by a lawyer before launch.'] },
      { title: 'What the site provides', body: ['GM7 provides information about its gaming community, social media content, streams, games, and tournaments. Visitors may sign in using Discord. Tournament registration details entered on this site are shown back to the visitor; continuing opens Discord to complete registration with the community.'] },
      { title: 'Accounts and age', body: ['Discord sign-in is subject to Discord’s own terms. The GM7 site currently has no age check. Minimum age: [MINIMUM AGE]. Eligibility and parental-consent requirements must be completed by the operator before account creation is enabled.'] },
      { title: 'Tournaments and prizes', body: ['Tournament names, dates, formats, entry details, slot counts, statuses, and prize descriptions are posted as site content. Current registration is completed in Discord, not through an on-site entry system. The official rules, eligibility, prize conditions, cancellations, and dispute contact for each event are [TOURNAMENT RULES URL / PROCESS].'] },
      { title: 'Payments and third-party services', body: ['The GM7 site does not process payments or sell subscriptions. A supporter flow selects a quantity of Kick gifted subscriptions and opens Kick to continue. Any purchase is made on Kick under the terms and checkout information shown by Kick.', 'The site links to or loads content from Discord, Kick, Google Fonts, YouTube, TikTok, and Instagram. Those services are governed by their own terms.'] },
      { title: 'Contact and governing terms', body: ['Contact: [CONTACT EMAIL]. Governing law and venue: [COUNTRY / REGION — LAWYER TO COMPLETE]. Effective date: [EFFECTIVE DATE].'] },
    ],
  },
  cookies: {
    title: 'Cookie and browser storage notice',
    sections: [
      { title: 'Draft status', body: ['DRAFT — NOT EFFECTIVE. This inventory reflects the current application code. Operator: [LEGAL NAME]. Contact: [CONTACT EMAIL]. Complete and review before launch.'] },
      { title: 'GM7 cookies', body: ['gm7_oauth_state: short-lived OAuth security state cookie, up to 10 minutes; HttpOnly, SameSite=Lax, and Secure when the configured site URL uses HTTPS.', 'gm7_session: signed sign-in session, up to 30 days; HttpOnly, SameSite=Lax, and Secure when the configured site URL uses HTTPS.', 'gm7_admin: signed dashboard session, up to 30 days; HttpOnly, SameSite=Lax, and Secure when the configured site URL uses HTTPS. The cookie is set by dashboard login.'] },
      { title: 'Browser storage', body: ['gm7_theme_mode is stored in browser local storage to remember the selected light or dark theme. It is not a cookie.'] },
      { title: 'Third-party requests', body: ['Google Fonts and embedded Kick player/chat frames load only after the visitor accepts optional content. An individual Kick frame can also be allowed using its on-page button. The choice is saved as gm7_optional_content_consent in browser local storage. Rejecting prevents those resources from loading. Externally hosted avatar or image resources may still make direct browser requests when displayed.', 'The site also obtains YouTube, Kick, TikTok, and Instagram feed or preview data server-side. The app records aggregate first-party usage counts; it does not include an analytics or advertising pixel. External providers may use their own storage under their own policies.'] },
      { title: 'Consent and settings', body: ['The optional-content prompt provides separate accept and reject buttons. This implementation is based on the code and is not a determination of legal consent requirements for [COUNTRIES / REGIONS]. Effective date: [EFFECTIVE DATE].'] },
    ],
  },
};

export const LegalPage: React.FC<{ document: LegalDocument }> = ({ document }) => {
  const { isDark } = useTheme();
  const content = DOCUMENTS[document];
  return (
    <article className={`mx-auto my-8 w-full max-w-4xl px-4 pb-20 sm:px-6 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
      <div className={`mb-8 rounded-xl border p-4 text-sm font-semibold ${isDark ? 'border-amber-400/40 bg-amber-400/10 text-amber-200' : 'border-amber-700 bg-amber-50 text-amber-950'}`}>
        DRAFT — NOT FOR PUBLICATION. Lawyer review required. Bracketed items need operator input.
      </div>
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{content.title}</h1>
      <p className={`mt-2 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Draft for [LEGAL NAME] · Last updated: [DATE]</p>
      <div className="mt-8 space-y-8">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold">{section.title}</h2>
            <div className={`mt-2 space-y-3 text-sm leading-7 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}
      </div>
      <nav aria-label="Legal documents" className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-500/30 pt-5 text-sm font-semibold underline underline-offset-4">
        <a href="/legal/privacy">Privacy policy</a>
        <a href="/legal/terms">Terms of service</a>
        <a href="/legal/cookies">Cookie notice</a>
      </nav>
    </article>
  );
};
