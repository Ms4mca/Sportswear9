import { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomepageLevels, selectHomepageLevels } from '../Home/HomePageSlice';

const MobileSidebar = ({ isOpen, onClose, openAuthModal, categories }) => {
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const dispatch = useDispatch();
  
  // Get homepage data from Redux
  const homepageLevels = useSelector(selectHomepageLevels);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fetch homepage levels when sidebar opens for images
      if (homepageLevels.length === 0) {
        dispatch(fetchHomepageLevels());
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, dispatch, homepageLevels.length]);

  // Get images from the API response for mobile sidebar with proper mapping
  const getMobileSidebarData = () => {
    if (!homepageLevels || homepageLevels.length === 0) return { categoryMap: {}, sectionMap: {} };
    
    // Find the "Mobile Sidebar section" (4th level)
    const mobileSidebarLevel = homepageLevels.find(level => 
      level.name === "Mobile Sidebar section" || level.order === 3
    );
    
    if (!mobileSidebarLevel || !mobileSidebarLevel.sections) return { categoryMap: {}, sectionMap: {} };
    
    const categoryMap = {}; // Maps category names to their images
    const sectionMap = {}; // Maps section titles to their items
    
    // Process each section to extract data
    mobileSidebarLevel.sections.forEach(section => {
      const sectionTitle = section.title || '';
      
      // Store section data with proper mapping - only store items that have images
      if (sectionTitle && section.items && section.items.length > 0) {
        sectionMap[sectionTitle] = section.items
          .filter(item => item.media?.[0]?.image) // Only include items with images
          .map(item => ({
            name: item.title,
            image: item.media[0].image,
            originalTitle: item.title
          }));
      }
      
      // Extract category images from "Main-Categories" section
      if (sectionTitle === "Main-Categories" && section.items) {
        section.items.forEach(item => {
          if (item.title && item.media?.[0]?.image) {
            categoryMap[item.title] = item.media[0].image;
          }
        });
      }
      
      // Store items with section context to prevent overwriting
      if (section.items) {
        section.items.forEach(item => {
          if (item.title && item.media?.[0]?.image) {
            // Store with section context to avoid collisions
            const keyWithSection = `${sectionTitle}::${item.title}`;
            categoryMap[keyWithSection] = item.media[0].image;
          }
        });
      }
    });
    
    return { categoryMap, sectionMap };
  };

  const { categoryMap, sectionMap } = getMobileSidebarData();

  // Helper function to find image with multiple matching strategies
  const findImage = (name, sectionName = '') => {
    if (!name) return null;
    
    // Try exact match with section context first
    if (sectionName) {
      const sectionContextKey = `${sectionName}::${name}`;
      if (categoryMap[sectionContextKey]) {
        return categoryMap[sectionContextKey];
      }
    }
    
    // Try exact match with name
    if (categoryMap[name]) {
      return categoryMap[name];
    }
    
    // Try case-insensitive match
    const lowerName = name.toLowerCase();
    const match = Object.keys(categoryMap).find(key => 
      key.toLowerCase() === lowerName || 
      key.toLowerCase().includes(lowerName) ||
      lowerName.includes(key.toLowerCase())
    );
    
    return match ? categoryMap[match] : null;
  };

  // Get all subcategories from all parent categories that have images
  const getAllSubcategoriesWithImages = () => {
    const allSubcategories = [];
    
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        if (category.subcategories && category.subcategories.length > 0) {
          category.subcategories.forEach(sub => {
            // Find image for this subcategory
            let subImage = null;
            
            // Try to find in specific sections
            const possibleSections = [
              category.name,
              "Men Collection",
              "Women Collection", 
              "Kids Collection",
              "Swimwear",
              "Accessories"
            ];
            
            for (const section of possibleSections) {
              if (sectionMap[section]) {
                const apiItem = sectionMap[section].find(item => 
                  item.name.toLowerCase() === sub.name.toLowerCase() ||
                  item.name.toLowerCase().includes(sub.name.toLowerCase()) ||
                  sub.name.toLowerCase().includes(item.name.toLowerCase())
                );
                if (apiItem) {
                  subImage = apiItem.image;
                  break;
                }
              }
            }
            
            // If still no image, try generic find
            if (!subImage) {
              subImage = findImage(sub.name);
            }
            
            // Only add subcategory if it has an image
            if (subImage) {
              allSubcategories.push({
                name: sub.name,
                image: subImage,
                uuid: sub.uuid,
                parentCategory: category.name
              });
            }
          });
        }
      });
    }
    
    return allSubcategories;
  };

  // Create leftCategories by mapping Navbar categories with API data
  const createLeftCategories = () => {
    const categoriesList = [];
    const allSubcategoriesWithImages = getAllSubcategoriesWithImages();
    
    // First, add "All Categories" only if it has an image
    const allCategoriesImage = categoryMap['All Categories'];
    if (allCategoriesImage) {
      // For All Categories, only show subcategories that have images
      categoriesList.push({
        id: 'all-categories',
        name: 'All Categories',
        image: allCategoriesImage,
        sections: [
          {
            title: 'All Categories',
            items: allSubcategoriesWithImages // Only subcategories with images
          }
        ]
      });
    }

    // Add main categories from Navbar that have images in Main-Categories
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        // Get category image from Main-Categories
        const categoryImage = categoryMap[category.name];
        
        // Only include categories that have images
        if (categoryImage) {
          const sections = [];
          
          // Get subcategories for this specific category that have images
          const categorySubcategoriesWithImages = allSubcategoriesWithImages.filter(
            sub => sub.parentCategory === category.name
          );
          
          // Only add section if there are subcategories with images
          if (categorySubcategoriesWithImages.length > 0) {
            sections.push({
              title: category.name,
              items: categorySubcategoriesWithImages
            });
          }
          
          // Only add category to left rail if it has at least one subcategory with image
          // or if we want to show empty categories (you can change this condition)
          if (categorySubcategoriesWithImages.length > 0) {
            categoriesList.push({
              id: category.uuid,
              name: category.name,
              image: categoryImage,
              sections: sections
            });
          }
        }
      });
    }

    // Add special categories only if they have images
    const newArrivalsImage = findImage('New Arrivals');
    if (newArrivalsImage) {
      // For New Arrivals, find any subcategories that might be related
      const newArrivalsItems = allSubcategoriesWithImages.filter(sub => 
        sub.name.toLowerCase().includes('new') || 
        sub.name.toLowerCase().includes('arrival')
      );
      
      categoriesList.push({
        id: 'new-arrivals',
        name: 'New Arrivals',
        image: newArrivalsImage,
        sections: newArrivalsItems.length > 0 ? [
          {
            title: 'New Arrivals',
            items: newArrivalsItems
          }
        ] : []
      });
    }

    const clearanceImage = findImage('Flash Clearance Sale') || findImage('Clearance');
    if (clearanceImage) {
      // For Clearance, find any subcategories that might be on sale
      const clearanceItems = allSubcategoriesWithImages.filter(sub => 
        sub.name.toLowerCase().includes('sale') || 
        sub.name.toLowerCase().includes('clearance')
      );
      
      categoriesList.push({
        id: 'clearance',
        name: 'Flash Clearance Sale',
        image: clearanceImage,
        sections: clearanceItems.length > 0 ? [
          {
            title: 'Clearance Sale',
            items: clearanceItems
          }
        ] : []
      });
    }

    return categoriesList;
  };

  // Create categories
  const leftCategories = createLeftCategories();

  // Set default selected category
  useEffect(() => {
    if (leftCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(leftCategories[0].name);
    }
  }, [leftCategories, selectedCategory]);

  // Bottom navigation links
  const bottomNavLinks = [
    { name: 'New Arrivals', id: "new-arrivals", icon: <Sparkles size={20} className="text-blue-600" /> },
    { name: 'Flash Clearance Sale', id: "clearance", icon: <Zap size={20} className="text-blue-600" /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
  };

  const handleAuthClick = () => {
    if (openAuthModal) {
      openAuthModal('login');
      onClose();
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    if (subcategory.uuid) {
      navigate(`/product/${subcategory.uuid}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(subcategory.name)}`);
    }
    onClose();
  };

  const handleBottomNavClick = (item) => {
    const category = leftCategories.find(cat => cat.name === item.name);
    if (category) {
      setSelectedCategory(category.name);
    } else {
      // If no matching category, navigate directly
      navigate(`/product/${item.id}`);
      onClose();
    }
  };

  const getSelectedCategoryData = () => {
    return leftCategories.find(cat => cat.name === selectedCategory) || leftCategories[0];
  };

  const selectedCategoryData = getSelectedCategoryData();

  // Show loading if no categories yet
  if (leftCategories.length === 0) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-black z-[60] xl:hidden transition-opacity duration-300 ${
            isOpen ? 'opacity-85 visible' : 'opacity-0 invisible'
          }`}
          onClick={onClose}
        />

        <div
          className={`fixed top-0 left-0 h-full w-full bg-white z-[70] xl:hidden flex flex-col transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center px-5 py-5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="text-2xl font-bold text-gray-900">Categories</div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-[60] xl:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-85 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white z-[70] xl:hidden flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-2xl font-bold text-gray-900">Categories</div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Categories Rail - Only shows categories that have images */}
          <div className="w-28 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 py-3">
            {leftCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`w-full flex flex-col items-center p-3 mb-1 transition-colors border-l-3 ${
                  selectedCategory === category.name
                    ? 'bg-blue-50 border-blue-600'
                    : 'border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 mb-2 flex items-center justify-center">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gray-200');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium text-center px-1 leading-tight ${
                  selectedCategory === category.name
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-900'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          {/* Right Sub-Categories Content - Only shows subcategories with images */}
          <div className="flex-1 bg-white overflow-y-auto py-5 px-4">
            {selectedCategoryData.sections && selectedCategoryData.sections.length > 0 ? (
              selectedCategoryData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  {/* Section Header with Divider */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {section.title === 'All Categories' ? 'All Products' : section.title}
                      </h3>
                    </div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* Subcategories Grid - Only shows items that have images */}
                  {section.items && section.items.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {section.items.map((item, idx) => (
                        <button
                          key={`${item.uuid || item.name}-${idx}`}
                          onClick={() => handleSubcategoryClick(item)}
                          className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
                        >
                          {/* Image Container - Always has image because we filtered */}
                          <div className="w-18 h-18 rounded-xl overflow-hidden bg-gray-100 mb-3 flex items-center justify-center shadow-inner group-hover:shadow-md transition-shadow duration-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('bg-gray-200');
                                e.target.parentElement.innerHTML = '<span class="text-xs text-gray-500">No Image</span>';
                              }}
                            />
                          </div>
                          
                          {/* Text Container */}
                          <div className="text-center w-full min-h-[2.5rem] flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                              {item.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null /* Don't show anything if no items with images */}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">📦</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedCategoryData.name}
                </h3>
                <p className="text-sm text-gray-600">
                  No products with images available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation - Fixed */}
        <div className="border-t border-gray-200 bg-gray-50 py-3 px-4 flex-shrink-0">
          <div className="flex justify-around">
            {bottomNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleBottomNavClick(item)}
                className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="mb-2">{item.icon}</div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;