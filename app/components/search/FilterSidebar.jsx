import {useFilters} from '~/contexts/FilterContext';
import {useState} from 'react';

export function FilterSidebar({availableFilters}) {
  const {filters, setFilters} = useFilters();
  const [tagSearch, setTagSearch] = useState('');

  const handlePriceChange = (min, max) => {
    setFilters({
      ...filters,
      price: [min, max]
    });
  };

  const handleVendorToggle = (vendor) => {
    setFilters({
      ...filters,
      vendors: filters.vendors.includes(vendor)
        ? filters.vendors.filter(v => v !== vendor)
        : [...filters.vendors, vendor]
    });
  };

  const handleTagToggle = (tag) => {
    setFilters({
      ...filters,
      tags: filters.tags.includes(tag)
        ? filters.tags.filter(t => t !== tag)
        : [...filters.tags, tag]
    });
  };

  const filteredTags = availableFilters.tags?.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      
      {filters.tags.length > 0 || filters.vendors.length > 0 ? (
        <div className="active-filters">
          {filters.tags.map(tag => (
            <span key={tag} className="filter-pill">
              {tag}
              <button onClick={() => handleTagToggle(tag)}>×</button>
            </span>
          ))}
          {filters.vendors.map(vendor => (
            <span key={vendor} className="filter-pill">
              {vendor}
              <button onClick={() => handleVendorToggle(vendor)}>×</button>
            </span>
          ))}
        </div>
      ) : null}

      {availableFilters.price && (
        <div className="filter-group">
          <h4>Price Range</h4>
          <PriceRangeFilter
            min={availableFilters.price.min}
            max={availableFilters.price.max}
            onChange={handlePriceChange}
          />
        </div>
      )}

      {availableFilters.vendors?.length > 0 && (
        <div className="filter-group">
          <h4>Vendors</h4>
          {availableFilters.vendors.map(vendor => (
            <label key={vendor}>
              <input
                type="checkbox"
                checked={filters.vendors.includes(vendor)}
                onChange={() => handleVendorToggle(vendor)}
              />
              {vendor}
            </label>
          ))}
        </div>
      )}

      {availableFilters.tags?.length > 0 && (
        <div className="filter-group">
          <h4>Tags</h4>
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="tag-search"
          />
          <div className="tag-list">
            {filteredTags.map(tag => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PriceRangeFilter({min, max, onChange}) {
  const [values, setValues] = useState([min, max]);

  return (
    <div className="price-range">
      <input
        type="range"
        min={min}
        max={max}
        value={values[0]}
        onChange={(e) => {
          const newValues = [parseInt(e.target.value), values[1]];
          setValues(newValues);
          onChange(...newValues);
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={values[1]}
        onChange={(e) => {
          const newValues = [values[0], parseInt(e.target.value)];
          setValues(newValues);
          onChange(...newValues);
        }}
      />
      <div className="price-display">
        ${values[0]} - ${values[1]}
      </div>
    </div>
  );
}