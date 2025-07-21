import React, { useState } from "react";
import { CATEGORIES } from "../App.js";

function CategoryFilter({ setCurrentCategory, setCurrentSubcategory }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              setCurrentCategory("all");
              setCurrentSubcategory(null);
              setExpandedCategory(null);
            }}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => {
                setCurrentCategory(cat.name);
                setCurrentSubcategory(null);
                setExpandedCategory(
                  expandedCategory === cat.name ? null : cat.name
                );
              }}
            >
              {cat.name}
            </button>

            {expandedCategory === cat.name &&
              cat.subcategories?.map((sub) => (
                <button
                  key={sub}
                  className="btn btn-subcategory"
                  onClick={() => setCurrentSubcategory(sub)}
                >
                  {sub}
                </button>
              ))}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default CategoryFilter;
