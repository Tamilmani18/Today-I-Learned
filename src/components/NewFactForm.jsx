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
  const textLength = text.length;

  const selectedCategoryObj = CATEGORIES.find((cat) => cat.name === category);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      text &&
      isValidHttpUrl(source) &&
      category &&
      subcategory &&
      textLength <= 200
    ) {
      setIsUploading(true);

      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category, subcategory }])
        .select();

      setIsUploading(false);

      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      else alert("Error creating fact");

      setText("");
      setSource("");
      setCategory("");
      setSubcategory("");
      setShowForm(false);
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

      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

export default NewFactForm;
