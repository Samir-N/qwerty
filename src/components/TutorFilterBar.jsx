import React, { useState } from 'react';
import { FaSearch, FaStar, FaDollarSign, FaGraduationCap, FaMapMarkerAlt, FaFilter, FaTimes } from 'react-icons/fa';

const TutorFilterBar = ({ onFiltersChange, tutors = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    subjects: [],
    priceRange: { min: '', max: '' },
    minRating: '',
    location: '',
    sortBy: 'rating' // rating, price-low, price-high, name
  });

  // Extract unique subjects from all tutors
  const availableSubjects = [...new Set(
    tutors.flatMap(tutor => tutor.subjects || [])
  )].sort();

  // Extract unique locations from all tutors
  const availableLocations = [...new Set(
    tutors.map(tutor => tutor.location).filter(Boolean)
  )].sort();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSubjectToggle = (subject) => {
    const newSubjects = filters.subjects.includes(subject)
      ? filters.subjects.filter(s => s !== subject)
      : [...filters.subjects, subject];
    handleFilterChange('subjects', newSubjects);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      subjects: [],
      priceRange: { min: '', max: '' },
      minRating: '',
      location: '',
      sortBy: 'rating'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.subjects.length > 0 || 
    filters.priceRange.min || filters.priceRange.max || filters.minRating || 
    filters.location || filters.sortBy !== 'rating';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaFilter className="text-indigo-600 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">Find Your Perfect Tutor</h2>
          {hasActiveFilters && (
            <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
              {filters.subjects.length + (filters.search ? 1 : 0) + 
               (filters.priceRange.min || filters.priceRange.max ? 1 : 0) + 
               (filters.minRating ? 1 : 0) + (filters.location ? 1 : 0)} filters active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <FaTimes />
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tutors by name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={`${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Subjects Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaGraduationCap className="text-indigo-600" />
              Subjects
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableSubjects.length > 0 ? (
                availableSubjects.map((subject) => (
                  <label key={subject} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No subjects available</p>
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaDollarSign className="text-green-600" />
              Price Range (per hour)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                {[10, 25, 50, 100].map((price) => (
                  <button
                    key={price}
                    onClick={() => handleFilterChange('priceRange', { min: '', max: price.toString() })}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    Under ${price}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>

          {/* Location & Sort */}
          <div className="space-y-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-600" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Any Location</option>
                {availableLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  Search: "{filters.search}"
                  <button onClick={() => handleFilterChange('search', '')} className="text-blue-600 hover:text-blue-800">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {filters.subjects.map((subject) => (
                <span key={subject} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {subject}
                  <button onClick={() => handleSubjectToggle(subject)} className="text-indigo-600 hover:text-indigo-800">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
              {(filters.priceRange.min || filters.priceRange.max) && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  ${filters.priceRange.min || '0'} - ${filters.priceRange.max || '∞'}
                  <button onClick={() => handleFilterChange('priceRange', { min: '', max: '' })} className="text-green-600 hover:text-green-800">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {filters.minRating && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {filters.minRating}+ Stars
                  <button onClick={() => handleFilterChange('minRating', '')} className="text-yellow-600 hover:text-yellow-800">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {filters.location}
                  <button onClick={() => handleFilterChange('location', '')} className="text-red-600 hover:text-red-800">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorFilterBar;
