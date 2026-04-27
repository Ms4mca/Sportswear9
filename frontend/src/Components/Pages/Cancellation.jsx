import React from "react";
import { RotateCcw, XCircle, RefreshCcw, Clock, ShieldCheck } from "lucide-react";

const CancellationReturnExchange = () => {
  return (
    <div className="w-full bg-gray-50 py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-5">
          Cancellation, Return & Exchange Policy – SportsWear9
        </h1>

        <p className="text-gray-600 text-center mb-10">
          We aim to make your shopping experience smooth and worry-free.  
          Please read our policies carefully before placing an order.
        </p>

        {/* Highlight Boxes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <HighlightCard
            icon={<XCircle size={40} className="mx-auto" />}
            title="Order Cancellation"
            text="Cancel before dispatch for a full refund."
          />
          <HighlightCard
            icon={<RotateCcw size={40} className="mx-auto" />}
            title="Easy Returns"
            text="Return within 7 days in original condition."
          />
          <HighlightCard
            icon={<RefreshCcw size={40} className="mx-auto" />}
            title="Easy Exchanges"
            text="Exchange size or product hassle-free."
          />
        </div>

        {/* ------- CANCELLATION POLICY ------- */}
        <PolicySection title="Order Cancellation Policy">
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>Orders can be cancelled only **before they are shipped**.</li>
            <li>Once dispatched, cancellation is not possible.</li>
            <li>COD orders with multiple failed attempts may be auto-cancelled.</li>
            <li>Refund for prepaid cancellations is initiated within **24–48 hours**.</li>
          </ul>
        </PolicySection>

        {/* ------- RETURN POLICY ------- */}
        <PolicySection title="Return Policy">
          <p className="text-gray-600">
            You may request a return within **7 days of delivery** if:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-600">
            <li>The product is unused and unwashed.</li>
            <li>All tags, labels, and packaging are intact.</li>
            <li>The item is not from a hygiene-sensitive category.</li>
            <li>You received a damaged, defective, or incorrect product.</li>
          </ul>
          <p className="mt-3 text-gray-600">
            Once approved, pickup will be arranged within **2–4 working days**.
          </p>
        </PolicySection>

        {/* Non-returnable Items */}
        <PolicySection title="Non-returnable Items">
          <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-600">
            <li>Innerwear, undergarments & lingerie</li>
            <li>Socks</li>
            <li>Customised / personalised items</li>
            <li>Items purchased under clearance or final sale</li>
          </ul>
        </PolicySection>

        {/* ------- EXCHANGE POLICY ------- */}
        <PolicySection title="Exchange Policy">
          <p className="text-gray-600">
            We allow exchanges for size or product variant within **7 days** of delivery.
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-600">
            <li>Item must be unused and in original condition.</li>
            <li>Only one-time exchange is allowed per order.</li>
            <li>Exchange depends on stock availability.</li>
          </ul>
        </PolicySection>

        {/* PROCESS FLOW */}
        <PolicySection title="How the Process Works">
          <div className="space-y-4 text-gray-600">
            <ProcessStep
              icon={<Clock size={26} />}
              text="Submit your return/exchange request through our support team."
            />
            <ProcessStep
              icon={<ShieldCheck size={26} />}
              text="Product is picked up and sent for quality inspection."
            />
            <ProcessStep
              icon={<RotateCcw size={26} />}
              text="Refund or exchange is processed after approval."
            />
          </div>
        </PolicySection>

        {/* REFUND INFO */}
        <PolicySection title="Refund Details">
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>Prepaid orders → refunded to the original payment method.</li>
            <li>COD orders → refunded as store credit or bank transfer.</li>
            <li>Refunds take **3–7 working days** after QC approval.</li>
          </ul>
        </PolicySection>

        {/* HELP SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Need Help?</h2>
          <p className="text-gray-600">
            Our support team is here to assist you 7 days a week.  
            For help with cancellations, returns, or exchanges, contact us anytime.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CancellationReturnExchange;

/* ------------------ Reusable Components ------------------ */

const HighlightCard = ({ icon, title, text }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition">
    {icon}
    <h3 className="font-semibold text-gray-800 mt-3">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{text}</p>
  </div>
);

const PolicySection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm mb-10">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

const ProcessStep = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-700">{icon}</div>
    <p>{text}</p>
  </div>
);
