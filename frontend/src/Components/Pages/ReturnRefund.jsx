import React from "react";
import { RotateCcw, AlertTriangle, CheckCircle2, PackageOpen } from "lucide-react";

const ReturnRefund = () => {
  return (
    <div className="w-full bg-gray-50 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-5">
          Return & Refund Policy – SportsWear9
        </h1>

        <p className="text-gray-600 text-center mb-10">
          We want you to love your purchase. If something isn’t right, we’re here to help!
        </p>

        {/* Policy Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-center transition">
            <RotateCcw size={40} className="mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">7-Day Easy Returns</h3>
            <p className="text-sm text-gray-600 mt-2">
              Eligible products can be returned within 7 days of delivery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-center transition">
            <PackageOpen size={40} className="mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Unopened Condition</h3>
            <p className="text-sm text-gray-600 mt-2">
              Items must be unused, unwashed, and in original packaging.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-center transition">
            <CheckCircle2 size={40} className="mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Fast Refunds</h3>
            <p className="text-sm text-gray-600 mt-2">
              Refunds processed within 3–7 business days after approval.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-center transition">
            <AlertTriangle size={40} className="mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Damaged Items</h3>
            <p className="text-sm text-gray-600 mt-2">
              If you receive a damaged product, contact us within 48 hours.
            </p>
          </div>
        </div>

        {/* Full Policy Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Full Return & Refund Policy
          </h2>

          <div className="text-gray-700 space-y-6">
            {/* Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✔ Eligibility for Returns</h3>
              <p>
                You may request a return if the product:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Is unused and unwashed</li>
                <li>Is in original packaging with tags</li>
                <li>Is returned within 7 days of delivery</li>
                <li>Is not a final sale or hygiene-sensitive item</li>
              </ul>
            </div>

            {/* Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✔ Non-Returnable Items</h3>
              <ul className="list-disc ml-6">
                <li>Innerwear & undergarments</li>
                <li>Socks</li>
                <li>Customised / personalised products</li>
                <li>Clearance sale items</li>
              </ul>
            </div>

            {/* Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✔ Return Pickup</h3>
              <p>
                Once your return is approved, our courier partner will pick up the product within 
                2–4 business days.
              </p>
            </div>

            {/* Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✔ Refund Process</h3>
              <p>Refunds are issued once the product passes quality check.</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Prepaid orders → refunded to original payment method</li>
                <li>COD orders → refunded as store credit or bank transfer</li>
                <li>Refund time → 3–7 working days</li>
              </ul>
            </div>

            {/* Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✔ Damaged / Defective Products</h3>
              <p>
                If the item is damaged, defective, or incorrect, contact us within 48 hours with:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Order ID</li>
                <li>Photos / video of the product</li>
                <li>Packaging images</li>
              </ul>
              <p className="mt-2">
                We will arrange a replacement or full refund.
              </p>
            </div>

            {/* Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✔ Need Help?</h3>
              <p>
                Our support team is available 7 days a week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefund;
