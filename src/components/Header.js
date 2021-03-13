import React from 'react';
import SearchBar from "./Searchbar";

const Header = ({onSearch}) => (
    <header>
        <SearchBar onSearch={onSearch}/>
    </header>

);

export default Header;
