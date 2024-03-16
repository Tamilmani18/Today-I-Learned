import React from 'react'

function Header({ showForm, setShowForm }) {
    const appTitle = "Today I Learned";

    return (
      
      <header className="header">
        <div className="logo">
          <img
            src="logo.png"
            alt="Logo of Today I Learned"
            height="68"
            width="68"
          />
          <h1>{appTitle}</h1>
        </div>

        <button
          className="btn btn-large btn-open"
          onClick={() => {
            setShowForm((show) => !show);
          }}
        >
          {showForm ? "Close" : "Share a Fact"}
        </button>
      </header>
    );
  }

  export default Header