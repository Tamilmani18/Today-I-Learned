import React, { useState } from "react";
import supabase from "../supabase";
import { CATEGORIES } from "../App.js";

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const textLength = text.length;
  const selectedCategoryObj = CATEGORIES.find((cat) => cat.name === category);

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!text || textLength > 200) {
      setError("Please enter a fact (max 200 characters).");
      return;
    }

    if (!isValidHttpUrl(source)) {
      setError("Please provide a valid source URL.");
      return;
    }

    if (!category) {
      setError("Please choose a category.");
      return;
    }

    if (selectedCategoryObj?.subcategories?.length > 0 && !subcategory) {
      setError("Please choose a subcategory.");
      return;
    }

    // Clear error and proceed
    setError("");
    setIsUploading(true);

    const { data: newFact, error } = await supabase
      .from("facts")
      .insert([{ text, source, category, subcategory }])
      .select();

    setIsUploading(false);

    if (!error) {
      setFacts((facts) => [newFact[0], ...facts]);
      setText("");
      setSource("");
      setCategory("");
      setSubcategory("");
      setShowForm(false);
    } else {
      setError("Something went wrong while posting your fact.");
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        value={text}
        type="text"
        placeholder="Share a fact with the world..."
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>

      <input
        value={source}
        type="text"
        placeholder="Trustworthy Source"
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />

      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setSubcategory("");
        }}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>

      {selectedCategoryObj?.subcategories && (
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={isUploading}
        >
          <option value="">Choose subcategory:</option>
          {selectedCategoryObj.subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      {/* ✅ Error message */}
      {error && <p style={{ color: "#ef4444", fontWeight: "bold" }}>{error}</p>}

      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

export default NewFactForm;
