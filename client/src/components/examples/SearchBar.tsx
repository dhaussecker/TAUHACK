import { SearchBar } from "../SearchBar";
import { useState } from "react";

export default function SearchBarExample() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-96">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search equipment..."
      />
    </div>
  );
}
