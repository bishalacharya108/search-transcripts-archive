'use client'
import { useState } from "react";
import axios from "axios";
import DashboardCard from "@/components/DashboardCard";
import Image from "next/image";
export default function SearchComponent() {
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searchUiParam, setSearchUiParam] = useState<string>("");
    const handleSearchInput = (e) => {
        setSearchValue(e.target.value)
    }
    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // const response = await axios.get("http://localhost:3000/api/search", {
            //     params: {
            //         searchValue
            //     }
            // });
            //TODO: There should be a limit to how big the search param can be
            const response = await axios.get("/api/search", {
                params: { searchValue }
            });
            setSearchUiParam(searchValue)

            //TODO: manage if no results are found

            setResults(response.data.data);
            console.log(response.data.data[0].highlights)

        } catch (error) {
            console.log(error)
            // throw new Error("Error fetching search params");
        }
    }
    return (
        <div className="flex flex-col justify-center mx-auto">
            <Image src={"/aum.ico"} width={200} height={200} alt="Aum" className="items-center mx-auto my-3 w-[11vw] h-[20vh] "></Image>
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6 lg:w-4xl mx-auto justify-center">
                <label className="flex items-center flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                    <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    {/*There should be a limit to how big of a search argument can be entered*/}
                    <input
                        type="search"
                        className="flex-1 outline-none mx-auto border-white"
                        value={searchValue}
                        onChange={handleSearchInput}
                        placeholder="Search transcripts..."
                        required
                    />
                </label>
                <button type="submit" className="btn btn-primary px-4 py-2 rounded-lg shadow hover:bg-green-600 border-none bg-green-700">
                    Search
                </button>
            </form>

            {results && results?.length > 0 ? (
                <>
                    <div className=" px-4 bg-white w-[50rem] mx-auto " >
                        <div className="text-[#50DA48] mb-1.5 ">Found {results?.length} results for {`"${searchUiParam}"`}</div>
                        <hr />
                    </div>
                    {
                        results.map((item, index) => (
                            <DashboardCard key={index} transcript={item} approved={true} />
                        ))
                    }
                </>
            ) : (
                <p className="text-center">Nothing</p>
            )}


        </div>
    )
}

