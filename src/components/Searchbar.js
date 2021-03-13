import React, { useState } from 'react';

import searchIcon from '../assets/search.svg'

const Searchbar = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSubmit = () => {
        if (searchText) {
            onSearch(searchText);
        }
    }

    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit()
        }
    }

    return (
        <div className='search-bar'>
            <input
                className="search-input"
                onChange={handleChange}
                type="text"
                value={searchText}
                placeholder="Search..."
                onKeyDown={handleEnter}
            />

            <button
                onClick={handleSubmit}
                className="search-btn"
            >
                <img src={searchIcon} alt="search"/>
            </button>
        </div>
    )
}
export default Searchbar;
