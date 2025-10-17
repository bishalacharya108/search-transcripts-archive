'use client'
import { useState } from "react";
import axios from "axios";
import DashboardCard from "@/components/DashboardCard";
import Image from "next/image";
export default function SearchComponent() {
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searchUiParam, setSearchUiParam] = useState<string>("");

    const [nextPageCursor, setNextPageCursor] = useState<{ lastScore: number, lastId: string } | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchResults = async (append = false) => {
        try {
            setLoading(true);
            setError(null);

            const params: any = { searchValue };
            if (append && nextPageCursor) {
                params.lastScore = nextPageCursor.lastScore;
                params.lastId = nextPageCursor.lastId;
            }

            const response = await axios.get("/api/search", { params });
            console.log(response.data)

            const { results: fetchedResults, nextPageCursor: cursor, hasNextPage } = response.data;


            // Append results if loading next page
            // TODO: need to change it and add next and previous button based pagination
            setResults(prev => append ? [...prev, ...fetchedResults] : fetchedResults);
            setNextPageCursor(cursor);
            setHasNextPage(hasNextPage);
            setSearchUiParam(searchValue);
        } catch (err: any) {
            console.log(err);
            setError("Failed to fetch search results");
        } finally {
            setLoading(false);
        }
    }

    const handleSearchInput = (e) => {
        setSearchValue(e.target.value)
    }

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchValue.trim()) return;
        setNextPageCursor(null);
        setHasNextPage(false);
        await fetchResults(false);
    }

    const handleLoadMore = async () => {
        if (!hasNextPage || !nextPageCursor) return;
        await fetchResults(true);
    };

    //TODO: use highlights in the ui
    return (
        <div className="flex flex-col justify-center mx-auto">
            <Image src={"/aum_white.svg"} width={200} height={200} alt="Aum" className="items-center mx-auto my-3 w-[11vw] h-[20vh]" />

            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6 lg:w-4xl mx-auto justify-center">
                <label className="flex items-center flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                    <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
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

            <div className="px-4 bg-white w-[52rem] mx-auto">
                {loading && <p className="text-center text-gray-600">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!results && <p className="text-center text-red-500">Nothing Searched Yet</p>}

                {/*TODO: result length is not correct, need to correct it*/}
                {results.length > 0 && (
                    <>
                        <div className="text-[#50DA48] mb-1.5">Found {results.length} results for "{searchUiParam}"</div>
                        <hr className="mb-3" />
                        {results.map((item, index) => (

                            <DashboardCard key={index} transcript={item} approved={true} />
                        ))}

                        {hasNextPage && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="px-5 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg shadow disabled:bg-gray-400"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {searchUiParam && results.length === 0 && !loading && !error && (
                    <p className="text-center text-gray-500">Nothing found</p>
                )}
                {!searchUiParam && !loading && !error && (
                    <p className="text-center text-gray-500">Enter a search term to find transcripts</p>
                )}
            </div>
        </div>
    )
}

