import React from "react";

const SearchBar: React.FC = () => {
  return (
    <header className="search-bar">
      <h1>Explore plant care tips</h1>
      <div className="search-input">
        <input type="text" placeholder="Search plants" />
        <button>Search</button>
      </div>
    </header>
  );
};

export default SearchBar;
