import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { ChevronLeft } from '../components/icons'

const EMAIL = 'info@groupargous.com'
const Mail = () => <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

// Kept in step with the client agreements (ARGO Universe,
// 05-clientes/contratos/plantillas: ES, EU and US). Duration, notice, billing,
// payment and portfolio use are chosen per client there, so these Terms
// defer to the signed agreement and only give the fallback.
export default function TermsOfService() {
  const { t } = useLang()

  return (
    <main id="main">
      <div className="container legal-page">
        <Link className="legal-back" to="/">
          <ChevronLeft size={16} /> {t.thankYou.cta}
        </Link>

        {/* Header */}
        <div>
          <h1>Terms of Service</h1>
          <div className="legal-rule" />
          <p className="legal-updated">Last updated: October 2026</p>
        </div>

        <div>

          {/* 1 */}
          <div>
            <h2>1. About These Terms</h2>
            <p>
              Group ARGO ("ARGO", "we", "us" or "our") is a growth partner for digital marketing and AI systems, working from Barcelona, Spain, and Miami, Florida, USA.
            </p>
            <p>
              These Terms have three parts. Part A applies to anyone using groupargous.com. Part B applies to the companies and people who engage our services ("Client", "you" or "your"). Part C applies to both.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2>2. These Terms and Your Agreement</h2>
            <p>
              Every engagement is defined in a proposal and a signed services agreement. If anything in these Terms conflicts with your signed agreement, the agreement prevails. These Terms apply to an engagement only for what the agreement does not cover.
            </p>
          </div>

          <p className="eyebrow legal-part">Part A · Using our website</p>

          {/* 3 */}
          <div>
            <h2>3. Our Content</h2>
            <p>
              The texts, design, logos and other content on this website belong to Group ARGO or are used with permission. You may read them, link to them and share them for your own information. Copying or reusing them for commercial purposes needs our written permission.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2>4. Information on This Website</h2>
            <p>
              What we publish here describes how we work and is general information. It is not an offer: what we do for a client, and on what terms, is set in their proposal and agreement. We keep the website accurate, but its content may change without notice.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2>5. Using the Website Fairly</h2>
            <p>
              Please do not send our forms false information or someone else's details, try to disrupt or overload the website, or use it for anything unlawful. We may block requests that do.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2>6. Links to Other Websites</h2>
            <p>
              Some links take you to other websites, such as LinkedIn, Instagram or WhatsApp. We do not control them and are not responsible for their content or their privacy practices.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2>7. Your Personal Data</h2>
            <p>
              How we handle the personal data you share through this website is explained in our <Link to="/privacy-policy">Privacy Policy</Link>, and the cookies we use in our <Link to="/cookie-policy">Cookie Policy</Link>.
            </p>
          </div>

          <p className="eyebrow legal-part">Part B · Our services</p>

          {/* 8 */}
          <div>
            <h2>8. Services</h2>
            <p>
              Group ARGO provides digital marketing (strategy, brand and creative, paid media, websites and SEO, content and email) and AI systems (internal platforms, custom applications, CRM and workflow automation). The scope of each engagement is set in its proposal and agreement.
            </p>
            <p>
              We use artificial intelligence tools, automated systems and third-party platforms as part of how we deliver our work.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2>9. Duration, Notice and Cancellation</h2>
            <p>
              How long an engagement runs, whether it has a minimum term and how much notice either side gives to end it are set in the agreement. Where the agreement does not say:
            </p>
            <ul>
              <li>The engagement runs month to month, with no minimum term.</li>
              <li>Either party may end it with 30 days' written notice to the other (for us, at <Mail />). Services continue as normal during the notice period.</li>
              <li>The final invoice covers the services provided up to the end date, pro-rated by day.</li>
              <li>Work in progress at the end date is delivered to the Client in its current state.</li>
              <li>Either party may end the engagement at once if the other seriously breaches it, including non-payment, and does not put it right within the time the agreement gives.</li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2>10. Billing and Payment</h2>
            <p>
              Fees, when invoices are issued and when they are due are set in the agreement. If an invoice remains unpaid after the notice period the agreement sets for non-payment, we may suspend the services until it is paid.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2>11. No Guarantee of Results</h2>
            <p>
              We do not guarantee specific outcomes, including leads, sales, revenue, return on investment, search rankings, reach or ad performance. Results depend on factors outside our control, such as platform and algorithm changes, market conditions, and decisions and information on the Client's side.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2>12. AI and Automation</h2>
            <p>
              AI tools and automated systems are part of our standard way of working. We review what they produce before it is delivered, but we do not represent that AI-generated content or automated outputs are free of errors.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2>13. Client Responsibilities</h2>
            <p>The Client agrees to:</p>
            <ul>
              <li>Provide accurate, complete and up-to-date information for the engagement</li>
              <li>Answer requests for feedback, approvals or assets in reasonable time</li>
              <li>Give us the access to platforms, accounts and tools the work requires</li>
              <li>Tell us promptly about changes that may affect the engagement</li>
            </ul>
            <p>
              We are not responsible for delays or results affected by these responsibilities not being met.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2>14. Intellectual Property</h2>
            <ul>
              <li><span className="legal-term">Your work:</span> original work we create specifically for the Client, such as ad creatives, copy, automations and reports, becomes the Client's property once the fees for the period in which it was created are paid.</li>
              <li><span className="legal-term">Our tools:</span> the tools, frameworks, templates and methods we developed before or independently of the engagement remain ours. Where they are part of what we deliver, the Client may use them for that delivery.</li>
              <li><span className="legal-term">Portfolio:</span> whether we may show the work or name the Client in our portfolio and case studies is set in the agreement. If it does not say, only with the Client's written permission.</li>
            </ul>
          </div>

          {/* 15 */}
          <div>
            <h2>15. Confidentiality</h2>
            <p>
              Both parties keep confidential the non-public information the other shares during the engagement, for as long as the agreement sets or, if it does not say, for two (2) years after the engagement ends.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2>16. Data Protection</h2>
            <ul>
              <li><span className="legal-term">Your customers' data:</span> when the Client shares personal data of its own customers or contacts with us (for example CRM records or advertising audiences), the Client is the controller and we process that data only on the Client's instructions, as its processor, under the data processing terms of the agreement (GDPR Article 28 and, in the United States, the applicable state laws). The Client confirms it has a lawful basis to share it.</li>
              <li><span className="legal-term">Your own contact details:</span> how we handle the details of the people we work with is explained in our <Link to="/privacy-policy">Privacy Policy</Link>.</li>
              <li><span className="legal-term">Third-party platforms:</span> the platforms used in the work, such as advertising networks, operate under their own terms and policies.</li>
            </ul>
          </div>

          {/* 17 */}
          <div>
            <h2>17. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, and unless the agreement says otherwise, our total liability to the Client for any claim related to the services is limited to the fees the Client paid for the most recent billing period, and we are not liable for indirect or consequential losses such as lost profits, lost data or business interruption. Nothing in these Terms limits liability that the law does not allow to be limited, such as for fraud or wilful misconduct.
            </p>
          </div>

          <p className="eyebrow legal-part">Part C · General</p>

          {/* 18 */}
          <div>
            <h2>18. Governing Law and Disputes</h2>
            <p>
              Where the agreement does not say otherwise: for Clients based in the European Union or the European Economic Area, these Terms are governed by Spanish law and disputes go to the courts of Barcelona, Spain; for everyone else, they are governed by the laws of the State of Florida and disputes go to the courts of Miami-Dade County, Florida.
            </p>
            <p>
              Before any legal action, both parties will try in good faith to resolve the disagreement by direct negotiation for fifteen (15) business days from written notice of it. Any mandatory consumer protection that applies to you under the law of your country is not affected.
            </p>
          </div>

          {/* 19 */}
          <div>
            <h2>19. Changes to These Terms</h2>
            <p>
              We may update these Terms, and the "Last updated" date at the top of this page will show when. An update does not change a signed agreement: that only changes when both parties agree in writing.
            </p>
          </div>

          {/* 20 */}
          <div>
            <h2>20. Contact</h2>
            <p>For questions about these Terms, please contact us at:</p>
            <div className="legal-card">
              <p className="legal-term">Group ARGO</p>
              <p>Barcelona, Spain · Miami, Florida, USA</p>
              <p>
                Email: <Mail />
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
