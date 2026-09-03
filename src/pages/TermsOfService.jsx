import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { ChevronLeft } from '../components/icons'

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
          <p className="legal-updated">Last updated: April 2026</p>
        </div>

        <div>

          {/* 1 */}
          <div>
            <h2>1. About These Terms</h2>
            <p>
              These Terms of Service ("Terms") govern the relationship between ARGO Group ("ARGO," "we," "us," or "our") and any individual or entity ("Client," "you," or "your") that engages ARGO for services. By accessing our website or engaging our services, you agree to be bound by these Terms.
            </p>
            <p>
              ARGO Group operates as a digital marketing and AI automation agency with offices in Barcelona, Spain, and Miami, Florida, USA.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2>2. Services</h2>
            <p>
              ARGO Group provides performance marketing, paid media management, workflow automation, AI-powered services, and CRM integration. The specific scope of services for each engagement is defined in a separate proposal or service agreement.
            </p>
            <p>
              ARGO reserves the right to use artificial intelligence tools, automated systems, and third-party platforms as part of its service delivery process.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2>3. Engagement Model</h2>
            <p>
              All engagements operate on a month-to-month basis. There are no long-term contracts or minimum commitment periods unless otherwise agreed in writing.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2>4. Billing & Payment</h2>

            <h3>4.1 Billing Cycle</h3>
            <p>
              Service fees are billed on a monthly basis. Invoices are issued and charges are processed between the 1st and 3rd day of each calendar month for that month's services.
            </p>

            <h3>4.2 Pro-Rated Billing Upon Cancellation</h3>
            <p>
              If a Client cancels services mid-month, billing will be calculated on a pro-rated basis up to the effective cancellation date. The Client is responsible for paying only for the days of service received within that billing period.
            </p>
            <p className="legal-note">
              Example: if services are cancelled on the 20th of the month, the Client is billed for 20 days of service proportional to the monthly fee.
            </p>

            <h3>4.3 Payment Terms</h3>
            <p>
              Invoices are due upon receipt. ARGO reserves the right to suspend services for accounts with outstanding unpaid balances.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2>5. Cancellation Policy</h2>

            <h3>5.1 Client Cancellation</h3>
            <p>
              Clients may cancel services at any time by providing 30 days' written notice to <a href="mailto:info@groupargous.com">info@groupargous.com</a>. The effective cancellation date will be determined from the date the written notice is received.
            </p>

            <h3>5.2 Pro-Rated Final Invoice</h3>
            <p>
              Upon cancellation, the Client will receive a final invoice calculated on a pro-rated basis from the first day of the final billing month to the effective cancellation date.
            </p>

            <h3>5.3 Work in Progress</h3>
            <p>
              Any work in progress at the time of cancellation will be delivered to the Client in its current state. ARGO does not guarantee completion of projects initiated after the cancellation notice is received.
            </p>

            <h3>5.4 ARGO-Initiated Cancellation</h3>
            <p>
              ARGO reserves the right to terminate a client engagement at any time with 30 days' written notice, or immediately in cases of breach of these Terms, non-payment, or conduct deemed harmful to ARGO or its personnel.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2>6. No Guarantee of Results</h2>
            <p>
              ARGO does not guarantee specific outcomes, including but not limited to leads generated, revenue growth, return on investment (ROI), search engine rankings, audience reach, or ad performance metrics. Results depend on multiple external factors outside ARGO's control, including platform algorithm changes, market conditions, client-side variables, and the nature of the Client's business.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2>7. AI & Automation Disclosure</h2>
            <p>
              ARGO integrates artificial intelligence tools and automated systems into its workflows as part of standard service delivery. By engaging ARGO Group's services, the Client acknowledges and accepts this practice. ARGO Group makes no representations that AI-generated content or automated outputs are error-free or will meet any specific standard, and retains editorial oversight over all deliverables.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2>8. Client Responsibilities</h2>
            <p>The Client agrees to:</p>
            <ul>
              <li>Provide accurate, complete, and up-to-date information relevant to the engagement</li>
              <li>Respond to requests for feedback, approvals, or assets in a timely manner</li>
              <li>Grant ARGO Group necessary access to platforms, accounts, and tools required to deliver services</li>
              <li>Notify ARGO Group promptly of any changes that may affect the engagement</li>
            </ul>
            <p>
              ARGO Group is not liable for delays, underperformance, or suboptimal results caused by the Client's failure to meet these responsibilities.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2>9. Intellectual Property</h2>

            <h3>9.1 Client Ownership</h3>
            <p>
              All original work created by ARGO Group specifically for a Client — including ad creatives, copy, automation workflows, and reports — becomes the Client's property upon receipt of full payment for the relevant period.
            </p>

            <h3>9.2 ARGO Group Portfolio Rights</h3>
            <p>
              ARGO Group retains the right to reference and display work completed for Clients in its portfolio, case studies, and marketing materials. If a Client wishes to restrict this use, they must submit a written request to <a href="mailto:info@groupargous.com">info@groupargous.com</a>, and ARGO Group will honor the request on a case-by-case basis.
            </p>

            <h3>9.3 Pre-Existing IP</h3>
            <p>
              Any tools, frameworks, templates, or methodologies developed by ARGO Group prior to or independently of the Client engagement remain the sole property of ARGO Group.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2>10. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary or sensitive information shared during the engagement. This obligation survives the termination of the relationship for a period of two (2) years.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2>11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ARGO Group's total liability to the Client for any claim arising out of or related to these Terms or the services provided shall not exceed the total fees paid by the Client in the most recent billing period.
            </p>
            <p>
              ARGO Group is not liable for indirect, incidental, consequential, or punitive damages, including loss of profits, loss of data, or business interruption, regardless of the cause.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2>12. Data Protection & Privacy</h2>

            <h3>12.1 General</h3>
            <p>
              ARGO Group collects and processes personal data in connection with the delivery of its services. By engaging ARGO Group, you consent to such processing in accordance with this section.
            </p>

            <h3>12.2 EU/EEA Clients — GDPR Compliance</h3>
            <p>
              For Clients based in the European Union or European Economic Area, ARGO processes personal data in compliance with the General Data Protection Regulation (GDPR) (EU) 2016/679. Clients have the right to access, rectify, erase, restrict, or port their personal data, and to lodge a complaint with a supervisory authority. To exercise any of these rights, contact <a href="mailto:info@groupargous.com">info@groupargous.com</a>.
            </p>

            <h3>12.3 Data Shared by Clients</h3>
            <p>
              Any personal data shared by the Client with ARGO Group (such as customer lists, CRM data, or ad audience information) must be provided in compliance with applicable data protection laws. The Client warrants that they have obtained all necessary consents to share such data.
            </p>

            <h3>12.4 Third-Party Platforms</h3>
            <p>
              ARGO Group uses third-party platforms and tools in the delivery of its services. These platforms operate under their own privacy and data policies. ARGO Group is not responsible for the data practices of third-party providers.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2>13. Governing Law & Dispute Resolution</h2>

            <h3>13.1 Primary Governing Law</h3>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of Florida, United States of America, without regard to its conflict of law provisions.
            </p>

            <h3>13.2 EU Consumer Protection</h3>
            <p>
              Notwithstanding the above, Clients based in the European Union retain the benefit of any mandatory consumer protection provisions applicable under the laws of their country of residence that cannot be excluded by contract.
            </p>

            <h3>13.3 Dispute Resolution</h3>
            <p>
              In the event of a dispute, both parties agree to first attempt resolution through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to the competent courts of Miami-Dade County, Florida, unless EU mandatory law requires otherwise.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2>14. Changes to These Terms</h2>
            <p>
              ARGO Group reserves the right to modify these Terms at any time. Active Clients will be notified of material changes at least 30 days in advance via email. Continued use of ARGO Group's services after the effective date of the updated Terms constitutes acceptance of the changes.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with any applicable service proposal or agreement, constitute the entire agreement between the parties and supersede all prior representations, discussions, or understandings.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2>16. Contact</h2>
            <p>For questions regarding these Terms, please contact:</p>
            <div className="legal-card">
              <p className="legal-term">ARGO Group</p>
              <p>
                Email: <a href="mailto:info@groupargous.com">info@groupargous.com</a>
              </p>
              <p>Barcelona, Spain · Miami, Florida, USA</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
