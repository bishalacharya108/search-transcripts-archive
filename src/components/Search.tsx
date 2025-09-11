'use client'
import { useState } from "react";
import axios from "axios";
export default function SearchComponent() {
    const [searchValue, setSearchValue] = useState();
    const handleSearchInput = (e) => {
        setSearchValue(e.target.value)
    }
    const handleSearchSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const response = await axios.get("http://localhost:3000/api/search/", {
                params: {
                    searchValue
                }
            });
            console.log(response)

        } catch (error) {
            console.log(error)
        }
    }
    return (

        <div className="flex">
            <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="search" className="w-auto" value={searchValue} onChange={handleSearchInput} required placeholder="Search Word" />
            </label>
            <button onClick={handleSearchSubmit} className="btn btn-outline">Search</button>
        </div>
  )
}

