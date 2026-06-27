// Advanced search and filtering utilities

/**
 * Full-text search across multiple fields
 */
export function searchItems(items, query, searchableFields) {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter(item => {
    return searchableFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Get nested object value by dot notation path
 * Example: getNestedValue(obj, 'user.profile.name')
 */
export function getNestedValue(obj, path) {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Advanced filter with multiple conditions
 */
export function filterItems(items, filters) {
  return items.filter(item => {
    return Object.entries(filters).every(([key, condition]) => {
      if (!condition) return true;

      const value = getNestedValue(item, key);

      // Handle different condition types
      if (Array.isArray(condition)) {
        // Include filter (OR)
        return condition.includes(value);
      } else if (typeof condition === 'object') {
        // Range or complex filter
        if (condition.min !== undefined && value < condition.min) return false;
        if (condition.max !== undefined && value > condition.max) return false;
        if (condition.equals !== undefined && value !== condition.equals) return false;
        if (condition.contains !== undefined && !value?.includes(condition.contains)) return false;
        return true;
      } else if (typeof condition === 'function') {
        // Custom filter function
        return condition(value);
      } else {
        // Exact match
        return value === condition;
      }
    });
  });
}

/**
 * Sort items by multiple fields with custom order
 */
export function sortItems(items, sortConfig) {
  if (!sortConfig || sortConfig.length === 0) return items;

  return [...items].sort((a, b) => {
    for (const { field, direction = 'asc', type = 'string' } of sortConfig) {
      const aValue = getNestedValue(a, field);
      const bValue = getNestedValue(b, field);

      let comparison = 0;

      if (type === 'string') {
        comparison = String(aValue || '').localeCompare(String(bValue || ''));
      } else if (type === 'number') {
        comparison = (aValue || 0) - (bValue || 0);
      } else if (type === 'date') {
        comparison = new Date(aValue) - new Date(bValue);
      }

      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

/**
 * Group items by field value
 */
export function groupItems(items, groupByField) {
  return items.reduce((groups, item) => {
    const groupKey = getNestedValue(item, groupByField);
    const key = groupKey || 'Unknown';

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);

    return groups;
  }, {});
}

/**
 * Paginate items
 */
export function paginateItems(items, page = 1, pageSize = 10) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    totalItems: items.length,
    totalPages: Math.ceil(items.length / pageSize),
    currentPage: page,
    pageSize,
  };
}

/**
 * Combined search + filter + sort
 */
export function advancedSearch(items, options = {}) {
  let results = items;

  // 1. Search
  if (options.query && options.searchableFields) {
    results = searchItems(results, options.query, options.searchableFields);
  }

  // 2. Filter
  if (options.filters) {
    results = filterItems(results, options.filters);
  }

  // 3. Sort
  if (options.sort) {
    results = sortItems(results, options.sort);
  }

  // 4. Paginate
  if (options.page !== undefined && options.pageSize !== undefined) {
    return paginateItems(results, options.page, options.pageSize);
  }

  return {
    items: results,
    totalItems: results.length,
  };
}

/**
 * Search with fuzzy matching (handles typos)
 */
export function fuzzySearch(items, query, searchableFields, options = {}) {
  const { threshold = 0.6 } = options;

  if (!query.trim()) return items;

  return items.filter(item => {
    return searchableFields.some(field => {
      const value = String(getNestedValue(item, field) || '').toLowerCase();
      return calculateSimilarity(value, query.toLowerCase()) >= threshold;
    });
  });
}

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Get edit distance (Levenshtein distance)
 */
function getEditDistance(s1, s2) {
  const costs = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}

/**
 * Extract unique values from items
 */
export function getUniqueValues(items, field) {
  const values = items.map(item => getNestedValue(item, field));
  return [...new Set(values.filter(Boolean))];
}

/**
 * Count occurrences of field values
 */
export function countFieldValues(items, field) {
  return items.reduce((counts, item) => {
    const value = getNestedValue(item, field);
    const key = value || 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

/**
 * Filter by date range
 */
export function filterByDateRange(items, dateField, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return items.filter(item => {
    const date = new Date(getNestedValue(item, dateField));
    return date >= start && date <= end;
  });
}

/**
 * Filter by numeric range
 */
export function filterByRange(items, field, min, max) {
  return items.filter(item => {
    const value = getNestedValue(item, field);
    return value >= min && value <= max;
  });
}

export default {
  searchItems,
  filterItems,
  sortItems,
  groupItems,
  paginateItems,
  advancedSearch,
  fuzzySearch,
  getUniqueValues,
  countFieldValues,
  filterByDateRange,
  filterByRange,
  getNestedValue,
};
