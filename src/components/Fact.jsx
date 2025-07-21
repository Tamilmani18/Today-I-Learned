import React, { useState } from "react";
import supabase from "../supabase";
import { CATEGORIES } from "../App.js";

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({
        [columnName]: fact[columnName] + 1,
      })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  const categoryObj = CATEGORIES.find((cat) => cat.name === fact.category);

  return (
    <li className="fact">
      <p>
        {isDisputed && <span className="disputed">[⛔️ DISPUTED]</span>}
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (source)
        </a>
      </p>

      <span
        className="tag"
        style={{ backgroundColor: categoryObj?.color || "#aaa" }}
      >
        {fact.category}
      </span>

      {fact.subcategory && (
        <span
          className="tag subcategory"
          style={{
            backgroundColor: "#9ca3af",
            marginLeft: "8px",
          }}
        >
          {fact.subcategory}
        </span>
      )}

      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default Fact;
