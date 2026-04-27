const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <p className="leading-relaxed mb-6">
              This Privacy Policy describes how we collect, use, process, and disclose your information, 
              including personal information, in connection with your access to and use of our website, 
              products, and services. We are committed to protecting your privacy and ensuring that your 
              personal information is handled in a safe and responsible manner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect various types of personal information that you voluntarily provide to us when 
              interacting with our services. This information is essential for providing you with a 
              seamless experience and includes:
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Identification Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-medium">Full Name:</span> We collect your complete legal name as provided during account registration or checkout to properly identify you, personalize communications, and ensure accurate order processing.</li>
                  <li><span className="font-medium">Email Address:</span> Your email serves as your primary account identifier and our main communication channel. We use it to send order confirmations, shipping updates, service notifications, promotional offers (with your consent), and password reset instructions.</li>
                  <li><span className="font-medium">Phone Number:</span> We collect your contact number for order verification, delivery coordination, fraud prevention, and customer service purposes. This allows our delivery partners to contact you regarding delivery schedules and enables us to reach you quickly regarding urgent order matters.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Address and Location Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-medium">Residential/Shipping Address:</span> We collect your complete street address, apartment/suite number, city, and state/province to ensure accurate delivery of physical products. This information is shared only with our trusted shipping partners and is essential for logistics planning and delivery route optimization.</li>
                  <li><span className="font-medium">Postal/ZIP Code:</span> Your postal code helps us calculate accurate shipping costs, determine delivery timelines, verify service availability in your area, and comply with regional tax regulations. This information also assists in regional market analysis and service expansion planning.</li>
                  <li><span className="font-medium">Billing Address:</span> For payment processing and fraud prevention, we verify that your billing address matches the address associated with your payment method. This additional verification layer helps protect against unauthorized transactions.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Demographic Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-medium">Age and Date of Birth:</span> We may collect this information to verify legal age requirements for certain products or services, send birthday promotions (with your consent), and better understand our customer demographics.</li>
                  <li><span className="font-medium">Gender:</span> When voluntarily provided, this helps us tailor product recommendations and marketing communications to better match your preferences and interests.</li>
                  <li><span className="font-medium">Language Preference:</span> We store your preferred language to deliver content, support, and communications in the language most comfortable for you.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-medium">Payment Details:</span> While we do not store complete credit card numbers on our servers, we securely process payment information through PCI-compliant third-party payment processors. We retain only the last four digits of your card for identification and customer service purposes.</li>
                  <li><span className="font-medium">Purchase History:</span> We maintain records of your transactions, including products purchased, amounts paid, dates of purchase, and payment methods used to provide better customer support, process returns, and personalize future recommendations.</li>
                  <li><span className="font-medium">Billing Information:</span> We store billing details including invoice addresses, tax identification numbers (where applicable), and payment method preferences for accounting purposes and regulatory compliance.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Technical and Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-medium">Device Information:</span> We collect data about the devices and browsers you use to access our services, including device type, operating system, browser version, IP address, and unique device identifiers for security monitoring and compatibility optimization.</li>
                  <li><span className="font-medium">Usage Data:</span> We track how you interact with our website—pages visited, features used, time spent on pages, click patterns, search queries, and navigation paths—to improve user experience and site functionality.</li>
                  <li><span className="font-medium">Location Data:</span> With your consent, we may collect approximate location information from your device to provide location-based services, show relevant content, and comply with regional regulations.</li>
                </ul>
              </div>

              <p className="text-gray-600 italic mt-4">
                We collect this information only with your explicit consent and provide clear opt-out 
                mechanisms for all non-essential data collection. You can update or delete your information 
                at any time through your account settings or by contacting our support team.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-3 ml-6">
              <li className="pb-2">
                <span className="font-medium">Order Processing and Fulfillment:</span> We use your name, address, phone number, and email to process orders, arrange shipping, send delivery notifications, and handle returns or exchanges. Your postal code helps calculate accurate shipping costs and delivery timelines.
              </li>
              <li className="pb-2">
                <span className="font-medium">Personalized Communication:</span> Using your name and purchase history, we create personalized email campaigns, product recommendations, and special offers tailored to your interests and shopping behavior.
              </li>
              <li className="pb-2">
                <span className="font-medium">Customer Support Enhancement:</span> We reference your contact information, order history, and previous interactions to provide efficient, personalized customer service and resolve inquiries quickly.
              </li>
              <li className="pb-2">
                <span className="font-medium">Account Management:</span> Your email and password (securely hashed) authenticate your identity and secure your account. We use your phone number for two-factor authentication when additional security is required.
              </li>
              <li className="pb-2">
                <span className="font-medium">Service Improvement:</span> We analyze usage patterns, demographic data, and feedback to enhance website functionality, develop new features, and optimize the user experience.
              </li>
              <li className="pb-2">
                <span className="font-medium">Security and Fraud Prevention:</span> We monitor account activity, verify identities, and detect suspicious behavior using your information to protect against unauthorized access, fraud, and security breaches.
              </li>
              <li className="pb-2">
                <span className="font-medium">Legal Compliance:</span> We use your information to comply with applicable laws, regulations, tax requirements, and legal processes, including responding to subpoenas or government requests.
              </li>
              <li className="pb-2">
                <span className="font-medium">Marketing and Advertising:</span> With your consent, we use demographic information and browsing behavior to display relevant advertisements, measure ad performance, and understand campaign effectiveness.
              </li>
              <li className="pb-2">
                <span className="font-medium">Business Operations:</span> We use aggregated, anonymized data for internal reporting, business planning, and strategic decision-making to improve our overall operations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p className="leading-relaxed mb-4">
              We take your privacy seriously and do not sell, trade, or rent your personal information 
              to third parties for their marketing purposes. However, we may share your information in 
              the following limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-3 ml-6">
              <li><span className="font-medium">Service Providers:</span> We share information with trusted partners who perform services on our behalf, such as payment processing, order fulfillment, shipping, email delivery, hosting, customer service, and marketing assistance. These providers are contractually obligated to protect your information and use it only for the services they provide.</li>
              <li><span className="font-medium">Legal Requirements:</span> We may disclose information if required by law, subpoena, or other legal process, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or respond to a government request.</li>
              <li><span className="font-medium">Business Transfers:</span> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company, your information may be transferred as a business asset.</li>
              <li><span className="font-medium">Aggregated or De-identified Data:</span> We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to identify you for research, marketing, analytics, or other business purposes.</li>
              <li><span className="font-medium">With Your Consent:</span> We will share your personal information with third parties when we have your explicit consent to do so.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="leading-relaxed mb-3">
              We implement comprehensive security measures designed to protect your personal information 
              from unauthorized access, alteration, disclosure, or destruction. Our security practices include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-6">
              <li>Encryption of sensitive data during transmission using SSL/TLS protocols</li>
              <li>Secure storage of personal information with access restricted to authorized personnel only</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Implementation of firewalls, intrusion detection systems, and other network security measures</li>
              <li>Employee training on data protection and privacy best practices</li>
              <li>Regular review and updating of our security policies and procedures</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Despite these measures, no method of transmission over the Internet or electronic storage 
              is 100% secure. We cannot guarantee absolute security but are committed to maintaining 
              appropriate safeguards to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              for which it was collected, including for the purposes of satisfying any legal, accounting, 
              or reporting requirements. Typically, we retain account information for as long as your 
              account is active or as needed to provide you services. Transaction records are generally 
              kept for 7 years to comply with tax and financial regulations. You may request deletion of 
              your information at any time, subject to legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed mb-3">
              We use cookies, web beacons, pixels, and similar tracking technologies to collect information 
              about your browsing activities and enhance your experience on our website:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-6">
              <li><span className="font-medium">Essential Cookies:</span> Required for basic site functionality, such as maintaining your shopping cart and enabling secure checkout</li>
              <li><span className="font-medium">Performance Cookies:</span> Collect anonymous data about how visitors use our site to improve its performance</li>
              <li><span className="font-medium">Functionality Cookies:</span> Remember your preferences and settings to personalize your experience</li>
              <li><span className="font-medium">Targeting/Advertising Cookies:</span> Used to deliver relevant advertisements and measure ad campaign effectiveness</li>
            </ul>
            <p className="leading-relaxed mt-4">
              You can control cookie settings through your browser preferences. However, disabling certain 
              cookies may limit your ability to use some features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-3 ml-6">
              <li><span className="font-medium">Right to Access:</span> Request a copy of the personal information we hold about you</li>
              <li><span className="font-medium">Right to Correction:</span> Update or correct inaccurate or incomplete information</li>
              <li><span className="font-medium">Right to Deletion:</span> Request deletion of your personal information, subject to legal exceptions</li>
              <li><span className="font-medium">Right to Restriction:</span> Request limitation of how we use your information</li>
              <li><span className="font-medium">Right to Data Portability:</span> Receive your information in a structured, commonly used format</li>
              <li><span className="font-medium">Right to Object:</span> Object to certain processing activities, including direct marketing</li>
              <li><span className="font-medium">Right to Withdraw Consent:</span> Withdraw previously given consent at any time</li>
              <li><span className="font-medium">Marketing Preferences:</span> Opt-out of receiving promotional communications through unsubscribe links or account settings</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below. We will 
              respond to your request within the timeframes required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="leading-relaxed">
              Your information may be transferred to, stored, and processed in countries other than your 
              country of residence. These countries may have data protection laws that differ from those 
              in your country. We take appropriate safeguards to ensure that your personal information 
              remains protected according to this Privacy Policy, including implementing standard 
              contractual clauses where required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="leading-relaxed">
              Our services are not directed to individuals under the age of 16. We do not knowingly 
              collect personal information from children under 16. If we become aware that we have 
              collected personal information from a child under 16 without verification of parental 
              consent, we take steps to remove that information from our servers. If you believe we 
              might have any information from or about a child under 16, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="leading-relaxed">
              Our website may contain links to third-party websites, plugins, or applications. Clicking 
              on those links may allow third parties to collect or share data about you. We do not control 
              these third-party websites and are not responsible for their privacy statements. We encourage 
              you to read the privacy policy of every website you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices, 
              technologies, legal requirements, or other factors. When we make changes, we will update 
              the "Last Updated" date at the bottom of this page. For material changes, we will provide 
              more prominent notice, such as through email notification or a banner on our website. We 
              encourage you to review this Privacy Policy regularly to stay informed about how we are 
              protecting your information.
            </p>
          </section>   

          <p className="text-sm text-gray-500 mt-10 pt-8 border-t">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;