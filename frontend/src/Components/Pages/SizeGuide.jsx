import React from "react";
import { Ruler, Shirt, Footprints, Scissors, StretchVertical } from "lucide-react";

const SizeGuide = () => {
  return (
    <div className="w-full bg-gray-50 my-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-5">
          Size Guide – SportsWear9
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Find the perfect fit for your sportswear. Use our detailed size charts for each category.
        </p>

        {/* Important Note */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-10">
          <div className="flex items-center gap-3">
            <Ruler className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-700">How to Measure</h2>
          </div>
          <ul className="list-disc ml-6 mt-3 text-gray-600 space-y-1">
            <li>Bust/Chest – Measure around the fullest part.</li>
            <li>Waist – Measure around your natural waistline.</li>
            <li>Hips – Measure around the fullest hip area.</li>
            <li>Inseam – Length from crotch to ankle.</li>
            <li>Foot Length – Measure from heel to toe.</li>
          </ul>
        </div>

        {/* ---------------- T-SHIRTS ---------------- */}
        <Section
          icon={<Shirt />}
          title="T-Shirts Size Guide"
          tableHeaders={["Size", "Chest (in)", "Length (in)"]}
          tableData={[
            ["S", "36–38", "26"],
            ["M", "38–40", "27"],
            ["L", "40–42", "28"],
            ["XL", "42–44", "29"],
            ["XXL", "44–46", "30"],
          ]}
        />

        {/* ---------------- LOWERS ---------------- */}
        <Section
          icon={<StretchVertical />}
          title="Lowers / Trackpants Size Guide"
          tableHeaders={["Size", "Waist (in)", "Hip (in)", "Length (in)"]}
          tableData={[
            ["S", "28–30", "36–38", "38"],
            ["M", "30–32", "38–40", "39"],
            ["L", "32–34", "40–42", "40"],
            ["XL", "34–36", "42–44", "41"],
            ["XXL", "36–38", "44–46", "42"],
          ]}
        />

        {/* ---------------- TOPS ---------------- */}
        <Section
          icon={<Scissors />}
          title="Tops Size Guide (Women)"
          tableHeaders={["Size", "Bust (in)", "Waist (in)"]}
          tableData={[
            ["XS", "30–32", "24–26"],
            ["S", "32–34", "26–28"],
            ["M", "34–36", "28–30"],
            ["L", "36–38", "30–32"],
            ["XL", "38–40", "32–34"],
          ]}
        />

        {/* ---------------- SHORTS ---------------- */}
        <Section
          icon={<StretchVertical />}
          title="Shorts Size Guide"
          tableHeaders={["Size", "Waist (in)", "Hip (in)"]}
          tableData={[
            ["S", "28–30", "36–38"],
            ["M", "30–32", "38–40"],
            ["L", "32–34", "40–42"],
            ["XL", "34–36", "42–44"],
          ]}
        />

        {/* ---------------- SPORTS BRA ---------------- */}
        <Section
          icon={<Ruler />}
          title="Sports Bra Size Guide"
          tableHeaders={["Size", "Bust (in)", "Underbust (in)"]}
          tableData={[
            ["XS", "28–30", "24–26"],
            ["S", "30–32", "26–28"],
            ["M", "32–34", "28–30"],
            ["L", "34–36", "30–32"],
            ["XL", "36–38", "32–34"],
          ]}
        />

        {/* ---------------- SHOES ---------------- */}
        <Section
          icon={<Footprints />}
          title="Shoe Size Guide (Unisex)"
          tableHeaders={["Foot Length (cm)", "EU Size", "UK Size", "US Size"]}
          tableData={[
            ["23.5", "37", "4", "5"],
            ["24.5", "38", "5", "6"],
            ["25.0", "39", "6", "7"],
            ["26.0", "40–41", "7", "8"],
            ["27.0", "42–43", "8", "9"],
            ["28.0", "44–45", "9", "10"],
          ]}
        />

        {/* ---------------- ACCESSORIES ---------------- */}
        <Section
          icon={<Ruler />}
          title="Accessories Size Guide"
          tableHeaders={["Accessory Type", "Size Information"]}
          tableData={[
            ["Gloves", "Measure palm width between 7–10 cm"],
            ["Caps / Headwear", "Free size fits 54–60 cm head circumference"],
            ["Socks", "Fits shoe sizes 5–11"],
            ["Gym Belts", "Small: 26–30 in | Medium: 30–34 in | Large: 34–38 in"],
          ]}
        />

      </div>
    </div>
  );
};

// -------------------- Reusable Section Component --------------------
const Section = ({ icon, title, tableHeaders, tableData }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm mb-10">
    <div className="flex items-center gap-3 mb-5">
      <div className="text-gray-700">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {tableHeaders.map((head, idx) => (
              <th key={idx} className="p-3 text-left text-sm font-semibold border">
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border text-gray-700 text-sm">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-3 border">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SizeGuide;
