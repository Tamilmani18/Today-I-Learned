import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";
import Header from "./components/Header";
import NewFactForm from "./components/NewFactForm";
import CategoryFilter from "./components/CategoryFilter";
import FactList from "./components/FactList";
import Loader from "./components/Loader";

const CATEGORIES = [
  {
    name: "technology",
    color: "#3b82f6",
    subcategories: ["Web Dev", "AI", "Cybersecurity"],
  },
  {
    name: "science",
    color: "#16a34a",
    subcategories: ["Physics", "Biology", "Chemistry"],
  },
  {
    name: "finance",
    color: "#ef4444",
    subcategories: ["Investment", "Banking", "Crypto"],
  },
  {
    name: "society",
    color: "#eab308",
    subcategories: ["Culture", "Politics", "Trends"],
  },
  {
    name: "entertainment",
    color: "#db2777",
    subcategories: ["TV", "Movies", "Gaming"],
  },
  {
    name: "health",
    color: "#14b8a6",
    subcategories: ["Nutrition", "Fitness", "Mental Health"],
  },
  {
    name: "history",
    color: "#f97316",
    subcategories: ["Ancient", "Modern", "War"],
  },
  {
    name: "news",
    color: "#8b5cf6",
    subcategories: ["Local", "Global", "Breaking"],
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from("facts").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
        if (currentSubcategory) {
          query = query.eq("subcategory", currentSubcategory);
        }
      }

      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);

      if (!error) {
        setFacts(facts);
      } else {
        alert("Error fetching facts");
      }

      setIsLoading(false);
    }

    getFacts();
  }, [currentCategory, currentSubcategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter
          setCurrentCategory={setCurrentCategory}
          setCurrentSubcategory={setCurrentSubcategory}
        />

        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

export default App;
export { CATEGORIES };
