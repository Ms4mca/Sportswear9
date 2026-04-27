import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const MegaMenu = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('All Sports');

  const categories = [
    'All Sports',
    'Men Collection', 
    'Women Collection',
    'Kids Collection',
    'Gift Cards',
    'Partner Brands',
  ];

  const categoryData = {
    'All Sports': [
      {
        title: 'Product of the month',
        items: ['Product of the month'],
      },
      {
        title: 'Outdoor Sports',
        items: [
          'Hiking & Trekking',
          'Camping',
          'Wildlife Watching',
          'Skiing & Snowboarding',
          'Rock Climbing & Mountaineering',
          'Fishing',
          'Horse Riding',
        ],
      },
      {
        title: 'Fitness Sports & Yoga',
        items: [
          'Fitness & Gym',
          'Yoga',
          'Kids Sports & Gymnastics',
          'Boxing & Martial Arts',
          'Installation & Service',
        ],
      },
      {
        title: 'Water Sports',
        items: [
          'Swimming',
          'Surfing & Beach Sports',
          'Snorkelling & Diving',
          'Kayaking & Stand Up Paddle',
          'Sailing',
        ],
      },
      {
        title: 'Racket Sports',
        items: ['Badminton', 'Tennis', 'Table Tennis', 'Squash', 'Padel'],
      },
      {
        title: 'Team Sports',
        items: [
          'Football',
          'Basketball',
          'Cricket',
          'Volleyball',
          'Hockey',
          'Rugby',
          'Baseball',
        ],
      },
      {
        title: 'Running & Walking',
        items: ['Running', 'Walking'],
      },
      {
        title: 'Cycling',
        items: ['Cycling', 'Cycle Servicing'],
      },
      {
        title: 'Roller Sports',
        items: ['Skating', 'Skateboarding', 'Scooter'],
      },
      {
        title: 'Explore A New Sport',
        items: ['Golf', 'Darts', 'Carrom', 'Billiards', 'Archery'],
      },
    ],
    'Men Collection': [
      {
        title: 'Men Topwear',
        items: [
          'Athleisure',
          'Cotton T-shirt',
          'Polo T-shirt',
          'Tank Tops',
          'Shirts',
          'Swim & Beach Tops',
          'Sweatshirts & Hoodies',
          'Fleeces & Pullovers',
          'T-shirts Under 999',
        ],
      },
      {
        title: 'Men Bottomwear',
        items: [
          'Shorts',
          'Track Pants & Joggers',
          'Trousers & Chinos',
          'Waterproof Rain Pants',
          'Tights & Compression',
          'Swim Costumes',
          'Shorts Under 999',
          'Track Pants Under 999',
        ],
      },
      {
        title: 'Footwear',
        items: [
          'Sports Shoes',
          'Sandals',
          'Flip Flops & Aqua Shoes',
          'Running Shoes',
          'Walking Shoes',
          'Outdoor Shoes & Boots',
          'Non Marking Shoes',
          'Football Shoes',
          'Socks',
        ],
      },
      {
        title: 'Jackets & Sweatshirts',
        items: [
          'Raincoat & Ponchos',
          'Sports Jackets',
          'Winter Jackets',
          'Warm & Waterproof Jackets',
          'Padded & Down Jackets',
          'Windcheaters',
          'Jackets Under 999',
        ],
      },
      {
        title: 'Innerwear',
        items: ['Thermals', 'Brief Underwear'],
      },
    ],
    'Women Collection': [
      {
        title: 'Women Topwear',
        items: [
          'T-shirts',
          'Polo T-shirts',
          'Tank Tops',
          'Crop Tops',
          'Sweatshirt & Hoodies',
          'Fleece & Pullovers',
          'Swim Costumes',
          'Activewear',
          'Raincoats',
        ],
      },
      {
        title: 'Women Bottomwear',
        items: [
          'Shorts',
          'Leggings',
          'Track Pants',
          'Trousers',
          'Skirts',
          'Under 999',
        ],
      },
      {
        title: 'Women Footwear',
        items: [
          'Sports Shoes',
          'Sandals',
          'Flip Flops',
          'Running Shoes',
          'Walking Shoes',
          'Outdoor Shoes & Boots',
          'Non Making Shoes',
          'Socks',
        ],
      },
      {
        title: 'Women Jackets',
        items: [
          'Sports Jackets',
          'Raincoats',
          'Windcheaters',
          'Sweaters',
          'Winter Jackets',
          'Snow Jackets',
          'Padded & Down Jackets',
        ],
      },
      {
        title: 'Women Innerwear',
        items: ['Sports Bra', 'Women Thermal Innerwear'],
      },
    ],
    'Kids Collection': [
      {
        title: 'Kids Collection',
        items: [
          'Topwear',
          'Bottomwear',
          'Footwear',
          'Underwear',
          'Activewear',
          'Accessories',
          'Sports Equipment',
        ],
      },
    ],
    'Gift Cards': [
      {
        title: 'Gift Cards',
        items: ['Gift Cards'],
      },
    ],
    'Partner Brands': [
      {
        title: 'Partner Brands',
        items: [
          'Adidas',
          'YONEX',
          'Coleman',
          'RAB',
          'Flexnest',
          'Lifelong',
          'Garmin',
          'powermax',
          'Sea to Summit',
          'WTB',
          'Lifestraw',
          'Campingaz',
          'Dynafit',
          'Blub',
          'Shokz',
          'Tifosi',
          'Lezyne',
          'Elite',
          'Tynor',
          'Ledlenser',
          'Leatherman',
          'Coros',
          'BABOLAT',
          'Salewa',
          'Fitbit',
        ],
      },
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="absolute w-full top-full UKnrtB z-50 bg-white">
      <div className="flex">
        <div className="w-4/5 pt-2 pb-3 md:px-7">
          {/* Category Tabs */}
          <div className="border-b border-grey-200">
            <div className="flex -mx-6 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <div key={category} className="px-6 cursor-pointer text-grey-700 flex-shrink-0">
                  <div
                    className={`NuObLK py-2 cursor-pointer select-none md:text-lg transition-colors ${
                      activeTab === category
                        ? 'KoDLoB border-blue-400 font-semibold text-blue-400'
                        : 'hover:text-blue-400'
                    }`}
                    onClick={() => setActiveTab(category)}
                  >
                    {category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Content */}
          <div className="flex flex-wrap py-3 -mt-5">
            {categoryData[activeTab]?.map((section, index) => (
              <div key={index} className="w-1/5 pt-5 min-w-0">
                <p className="font-semibold text-grey-600 md:mb-1 md:text-[17px]">
                  {section.title}
                </p>
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="py-1 block text-14 md:text-[14px] text-grey-600 hover:text-blue-400 transition-colors truncate"
                    onClick={onClose}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 bg-white/80">
          <Link
            to="https://play.google.com/store/apps/details?id=com.evamall.evacustomer"
            target="_blank"
            className="block"
          >
            <img
              className="w-full"
              src="https://contents.mediadecathlon.com/s1073004/k$aff8c6f539f42ddcd09912fdbba9bd62/defaut.jpg"
              alt="Download App"
            />
            <div className="p-3 block bg-blue-400 text-14 text-white text-center font-medium">
              DOWNLOAD NOW
            </div>
          </Link>
          <div className="py-4 md:px-2">
            {[
              { name: 'Clearance', link: '/clearance' },
              { name: 'Online Exclusive Models', link: '/online-exclusive' },
              { name: 'New Arrivals', link: '/new-arrivals' },
              { name: 'Support', link: '/support' },
              { name: 'Decathlon Stores', link: '/stores' },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="block hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="px-3 py-1 flex items-center justify-between">
                  <p className="text-14 md:text-[14px]">{item.name}</p>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;