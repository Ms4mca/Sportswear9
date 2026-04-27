import React from "react";
import { Truck, Clock, ShieldCheck, Globe } from "lucide-react";

const ShippingDelivery = () => {
  return (
    <div className="w-full bg-gray-50 my-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Shipping & Delivery – SportsWear9
        </h1>
        <p className="text-gray-600 mb-10">
          Fast, secure, and reliable shipping for all your sportswear needs.
        </p>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <Truck className="mx-auto mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-800">Fast Delivery</h3>
            <p className="text-gray-600 text-sm mt-2">
              Orders shipped within 24–48 hours from confirmation.
            </p>
          </div>

          {/* Item */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <Clock className="mx-auto mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-800">Delivery Time</h3>
            <p className="text-gray-600 text-sm mt-2">
              Standard delivery: 3–7 business days depending on your location.
            </p>
          </div>

          {/* Item */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <ShieldCheck className="mx-auto mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-800">Secure Packaging</h3>
            <p className="text-gray-600 text-sm mt-2">
              Products are packed securely to avoid any transit damage.
            </p>
          </div>

          {/* Item */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <Globe className="mx-auto mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-800">Pan-India Shipping</h3>
            <p className="text-gray-600 text-sm mt-2">
              We deliver across all major cities and towns in India.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Shipping Details
          </h2>
          <ul className="text-gray-700 text-left space-y-3">
            <li>• Free shipping on orders above ₹999.</li>
            <li>• Tracking link provided once the order is dispatched.</li>
            <li>• COD available on most products.</li>
            <li>• Delays may occur during holidays or sale seasons.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
