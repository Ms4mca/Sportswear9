import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Heart,
  Store,
  MessageSquare,
} from 'lucide-react';
import MegaMenu from './MegaMenu';

function Navbar() {
  const navigate = useNavigate();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const searchInputRef = useRef(null);

  const placeholders = [
    'Cricket Bats',
    'Carrom Boards', 
    'Sports Shoes',
    'Fitness Equipment',
    'Running Gear',
    'Swimming Accessories',
    'Football',
    'Badminton Rackets',
    'Yoga Mats',
    'Cycling Gear',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (localSearch || '').trim();
    if (!q) return;
    navigate(`/categories?q=${encodeURIComponent(q)}`);
    setLocalSearch('');
  };

  const toggleMegaMenu = () => {
    setMegaMenuOpen(!megaMenuOpen);
  };

  return (
    <>
      <header className="top-0 z-50 md:z-30 lg:sticky">
        <div className="relative md:z-auto">
          <div className="bg-white">
            <div className="px-4 py-3 2xl:px-16 xl:py-4">
              <div className="flex items-center justify-between">
                {/* Left side: Menu button and Logo */}
                <div className="flex items-center w-1/2 md:w-auto">
                  <button
                    type="button"
                    aria-label="mega-menu"
                    className="flex items-center hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={toggleMegaMenu}
                  >
                    <div>
                      {megaMenuOpen ? (
                        <X size={32} strokeWidth={2} />
                      ) : (
                        <Menu size={32} strokeWidth={2} />
                      )}
                    </div>
                    <p className="hidden ml-4 leading-5 text-left uppercase lg:block text-16 font-medium">
                      All <br /> Sports
                    </p>
                  </button>
                  <Link
                    to="/"
                    className="ml-3 cursor-default md:ml-6 lg:ml-12"
                  >
                    <svg 
                      viewBox="0 0 188 28" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-full lg:w-36 cursor-pointer h-7"
                    >
                      <path d="M57.9108 23.8H71.1548V19.544H62.9508V15.974H70.2169V12.012H62.9508V8.442H71.1548V4.2H57.9108V23.8ZM87.5909 15.358C85.6728 18.41 83.8108 19.684 81.4168 19.684C78.3088 19.684 76.5028 17.5 76.5028 13.706C76.5028 10.108 78.1688 8.316 80.7309 8.316C82.4248 8.316 83.8248 9.072 84.2589 11.592H89.2989C88.7528 6.79 85.6869 3.808 80.7868 3.808C75.1028 3.808 71.3648 7.82599 71.3648 13.986C71.3648 20.188 75.1028 24.192 81.2488 24.192C85.2669 24.192 87.9968 22.512 89.8028 20.244H96.6768V23.8H101.689V4.2H94.5769L87.5909 15.358ZM96.6768 16.31H92.2388L96.6768 9.1V16.31ZM47.1588 4.2H39.7948V23.8H47.1588C52.9969 23.8 56.7628 19.95 56.7628 14C56.7628 8.05 52.9969 4.2 47.1588 4.2ZM47.0888 19.544H44.8348V8.442H47.0888C50.0008 8.442 51.6388 10.5 51.6388 14C51.6388 17.486 50.0008 19.544 47.0888 19.544ZM159.537 3.808C153.615 3.808 149.639 7.826 149.639 14C149.639 20.174 153.615 24.192 159.537 24.192C165.473 24.192 169.435 20.174 169.435 14C169.435 7.82601 165.473 3.808 159.537 3.808ZM159.537 19.684C156.625 19.684 154.791 17.738 154.791 14C154.791 10.262 156.625 8.316 159.537 8.316C162.463 8.316 164.283 10.262 164.283 14C164.283 17.738 162.463 19.684 159.537 19.684ZM102.949 8.442H107.891V23.8H112.931V8.442H117.873V4.2H102.949L102.949 8.442ZM182.301 4.2V14.994L175.805 4.2H170.583V23.8H175.455V12.558L182.217 23.8H187.173V4.2L182.301 4.2ZM142.499 4.2H137.459V23.8H150.101V19.558H142.499V4.2ZM130.963 11.676H124.173V4.2H119.133V23.8H124.173V15.904H130.963V23.8H136.003V4.2H130.963V11.676Z" fill="#3643BA"/>
                      <path d="M25.5711 0C14.6267 0 1.01309 11.3236 1.01309 20.7085C1.01309 25.5554 4.73612 28 9.65333 28C13.264 28 17.6333 26.6794 21.848 24.1365V5.40893C20.7241 7.33366 15.4416 15.0888 11.1987 19.2193C9.03518 21.3266 7.32118 22.2398 5.84602 22.2398C4.18821 22.2398 3.40146 21.1159 3.40146 19.4441C3.40146 11.8575 16.1722 1.99498 24.6298 1.99498C28.114 1.99498 30.3618 3.54039 30.3618 6.54692C30.3618 9.30055 28.4933 12.7566 25.3041 15.9458V21.7481C30.8676 17.3507 34.1972 11.7451 34.1972 7.22127C34.1972 2.4586 30.4883 0 25.5711 0Z" fill="#3643BA"/>
                    </svg>
                  </Link>
                </div>

                {/* Center: Search bar and Location */}
                <div className="flex items-center flex-grow lg:pr-0 md:ml-2 xl:pr-6 xl:pl-14 2xl:pr-4">
                  {/* Desktop Search */}
                  <div className="static flex w-full rounded-full lg:relative lg:h-10">
                    <div className="hidden w-full overflow-hidden rounded-full md:block md:relative">
                      <div className="md:relative h-full bg-white">
                        <div className="bg-grey-50 rounded-full">
                          <form
                            onSubmit={handleSearch}
                            className="py-0 md:py-4 lg:py-2 w-full flex items-center h-full px-0 xs:px-1 md:px-3 outline-none HgISxI text-12 sm:text-14 lg:text-base sm:tracking-wide"
                          >
                            <Search size={24} strokeWidth={1.5} className="mr-2 text-grey-500 w-5" />
                            <span className="!mr-1 text-12 sm:text-14">Search for </span>
                            <input
                              ref={searchInputRef}
                              type="text"
                              value={localSearch}
                              onChange={(e) => setLocalSearch(e.target.value)}
                              placeholder={`"${placeholders[currentPlaceholder]}"`}
                              className="bg-transparent outline-none flex-1 font-bold text-12 sm:text-14 placeholder:font-bold"
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="ml-3 md:block lg:ml-4 xl:ml-14">
                    <div className="relative">
                      <p className="text-center text-12 lg:text-14 whitespace-nowrap text-grey-900">
                        Delivery Location
                      </p>
                      <div className="flex justify-center">
                        <span className="text-14 lg:text-16 font-bold text-blue-400">560001</span>
                        <button
                          type="button"
                          className="ml-1 text-12 lg:text-14 text-blue-400 uppercase underline border-none outline-none hover:text-blue-600 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Mobile icons and Desktop navigation */}
                <div className="flex items-center lg:hidden ml-2">
                  <Link
                    to="/signin"
                    className="px-2 md:px-3 py-1 border uppercase YXYCyh rounded-full text-10 text-nowrap hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <div className="flex justify-right items-center">
                    <Link to="/wishlist" className="hover:bg-gray-50 p-2 rounded transition-colors">
                      <div className="relative">
                        <Heart size={24} strokeWidth={1.5} className="w-6 ml-3" />
                      </div>
                    </Link>
                  </div>
                  <div className="flex justify-right items-center">
                    <Link to="/cart" className="hover:bg-gray-50 p-2 rounded transition-colors">
                      <div className="relative">
                        <ShoppingCart size={24} strokeWidth={1.5} className="w-6 ml-3" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Desktop Navigation Icons */}
                <div className="hidden -mx-2 lg:flex 2xl:ml-6">
                  <Link to="/signin" className="mx-5 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="relative flex flex-col group">
                      <User size={24} strokeWidth={1.5} className="mx-auto" />
                      <p className="mt-1 text-center KJWhFJ">Sign In</p>
                    </div>
                  </Link>
                  <Link to="/store" className="mx-5 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="relative flex flex-col group">
                      <Store size={24} strokeWidth={1.5} className="mx-auto" />
                      <p className="mt-1 text-center KJWhFJ">My Store</p>
                    </div>
                  </Link>
                  <Link to="/support" className="mx-5 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="relative flex flex-col group">
                      <MessageSquare size={24} strokeWidth={1.5} className="mx-auto" />
                      <p className="mt-1 text-center KJWhFJ">Support</p>
                    </div>
                  </Link>
                  <Link to="/wishlist" className="mx-5 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="">
                      <div className="relative">
                        <Heart size={24} strokeWidth={1.5} className="mx-auto" />
                      </div>
                      <p className="mt-1 text-center KJWhFJ">Wishlist</p>
                    </div>
                  </Link>
                  <Link to="/cart" aria-label="cart" className="mx-5 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="">
                      <div className="relative">
                        <ShoppingCart size={24} strokeWidth={1.5} className="mx-auto" />
                      </div>
                      <p className="mt-1 text-center KJWhFJ">Cart</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Mobile Search Bar */}
              <div className="flex mt-2 md:hidden">
                <div className="flex items-center flex-grow">
                  <div className="relative w-full">
                    <div className="block w-full py-3 pl-3 pr-4 rounded-full outline-none text-12 bg-grey-50">
                      <form
                        onSubmit={handleSearch}
                        className="py-0 w-full flex items-center h-full outline-none text-12 tracking-wide"
                      >
                        <Search size={24} strokeWidth={1.5} className="mr-2 text-grey-500 w-5" />
                        <span className="!mr-1">Search for </span>
                        <input
                          type="text"
                          value={localSearch}
                          onChange={(e) => setLocalSearch(e.target.value)}
                          placeholder={`"${placeholders[currentPlaceholder]}"`}
                          className="bg-transparent outline-none flex-1 font-bold placeholder:font-bold"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
      </header>

      {/* Overlay */}
      {megaMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setMegaMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;