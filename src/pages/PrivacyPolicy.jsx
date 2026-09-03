import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { ChevronLeft } from '../components/icons'

export default function PrivacyPolicy() {
  const { t } = useLang()

  return (
    <main id="main">
      <div className="container legal-page">
        <Link className="legal-back" to="/">
          <ChevronLeft size={16} /> {t.thankYou.cta}
        </Link>

        {/* Header */}
        <div>
          <h1>Privacy Policy</h1>
          <div className="legal-rule" />
          <p className="legal-updated">Last updated: April 2026</p>
        </div>

        <div>

          {/* 1 */}
          <div>
            <h2>1. Who We Are</h2>
            <p>
              ARGO Group is a digital marketing and AI automation agency with offices in Barcelona, Spain, and Miami, Florida, USA. We provide performance marketing, workflow automation, AI-powered services, and CRM integration to clients worldwide.
            </p>
            <p>
              For any privacy-related questions or requests, please contact us at: <a href="mailto:info@groupargous.com">info@groupargous.com</a>
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2>2. Scope of This Policy</h2>
            <p>
              This Privacy Policy applies to all visitors of our website and clients who engage with our services. It governs how we collect, use, store, and protect personal data across our digital properties and service delivery systems. Given our international presence, we comply with applicable data protection regulations including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2>3. Data We Collect</h2>
            <p>We collect personal data in the following ways:</p>
            <ul>
              <li>
                <span className="legal-term">Contact Form Submissions:</span> When you fill out a form on our website, we collect your name, email address, company name, phone number (if provided), subject, and message content.
              </li>
              <li>
                <span className="legal-term">Cookies and Analytics:</span> We use cookies and similar tracking technologies to understand how visitors interact with our website, measure performance, and improve user experience. This may include session data, page views, referral sources, and device information.
              </li>
              <li>
                <span className="legal-term">Client Service Data:</span> As part of delivering our services — including performance marketing campaigns, CRM integrations, and automation workflows — we may process data you share with us relating to your business, customers, and operations.
              </li>
              <li>
                <span className="legal-term">Communication Data:</span> When you communicate with us via email, WhatsApp, or Slack, we retain those communications for service continuity and support purposes.
              </li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2>4. How We Use Your Data</h2>
            <ul>
              <li>To respond to your inquiries and provide our services</li>
              <li>To manage client accounts and deliver contracted marketing and automation services</li>
              <li>To analyze website performance and improve our digital experience</li>
              <li>To send relevant communications about our services (only with your consent)</li>
              <li>To comply with legal obligations and enforce our agreements</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2>5. Third-Party Tools and Service Providers</h2>
            <p>
              We use third-party platforms to operate our business and deliver services. These fall into the following categories:
            </p>
            <ul>
              <li><span className="legal-term">CRM Platforms:</span> Tools such as HubSpot and Pipedrive to manage leads and client data</li>
              <li><span className="legal-term">Analytics Tools:</span> Platforms used to track website traffic and campaign performance</li>
              <li><span className="legal-term">Email and Communication Tools:</span> Services used to manage client communications and automated email sequences</li>
              <li><span className="legal-term">Automation Platforms:</span> Tools including n8n and Make used to build and run workflow automations</li>
              <li><span className="legal-term">Advertising Platforms:</span> Meta Ads, Google Ads, TikTok Ads, and LinkedIn Ads, through which campaign data is processed</li>
              <li><span className="legal-term">AI Tools:</span> Artificial intelligence platforms used in service delivery, content generation, and data processing</li>
            </ul>
            <p>
              Each of these providers has their own privacy policies and data processing terms. We only share the minimum data necessary for service delivery.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2>6. AI and Automation Disclosure</h2>
            <p>
              ARGO Group uses artificial intelligence and automated systems as part of our service delivery. This includes AI-powered content generation, lead scoring, personalized messaging, and workflow automation. Data processed through these systems is handled in accordance with this Privacy Policy and applicable data protection laws.
            </p>
            <p>
              Where automated decision-making may have a significant effect on you or your business, we will inform you and provide the opportunity to request human review.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2>7. Data Retention</h2>
            <p>
              We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law. Contact form data is retained for up to 24 months. Client service data is retained for the duration of the engagement and up to 3 years thereafter, unless otherwise agreed.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2>8. International Data Transfers</h2>
            <p>
              As a company operating in both Spain (EU) and the USA, your data may be transferred between these jurisdictions. For EU users, any transfer of personal data outside the European Economic Area (EEA) is conducted under appropriate safeguards, including Standard Contractual Clauses (SCCs) where applicable.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2>9. Your Rights (GDPR — EU Users)</h2>
            <p>If you are located in the European Union, you have the following rights under the GDPR:</p>
            <ul>
              <li><span className="legal-term">Right of Access:</span> Request a copy of the personal data we hold about you</li>
              <li><span className="legal-term">Right to Rectification:</span> Request correction of inaccurate or incomplete data</li>
              <li><span className="legal-term">Right to Erasure:</span> Request deletion of your personal data ("right to be forgotten")</li>
              <li><span className="legal-term">Right to Restriction:</span> Request that we limit the processing of your data</li>
              <li><span className="legal-term">Right to Data Portability:</span> Receive your data in a structured, machine-readable format</li>
              <li><span className="legal-term">Right to Object:</span> Object to processing based on legitimate interests or for direct marketing</li>
              <li><span className="legal-term">Right to Withdraw Consent:</span> Withdraw consent at any time where processing is based on consent</li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2>10. Your Rights (US Users)</h2>
            <p>
              Depending on your state of residence, you may have the right to access, correct, or delete the personal information we hold about you. You may also have the right to opt out of certain data processing activities. To make any such request, contact us at <a href="mailto:privacy@argoagency.com">privacy@argoagency.com</a> and we will respond within 30 days.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2>11. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. These include essential cookies required for the site to function, as well as analytics cookies that help us understand usage. You may control cookie preferences through your browser settings. Note that disabling certain cookies may affect site functionality.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2>12. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The "Last updated" date at the top of this page will reflect any revisions. We encourage you to review this page periodically.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2>14. Contact Us</h2>
            <p>
              To exercise any of your rights, or if you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="legal-card">
              <p className="legal-term">ARGO Group</p>
              <p>Barcelona, Spain · Miami, Florida, USA</p>
              <p>
                Email: <a href="mailto:info@groupargous.com">info@groupargous.com</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
