//TODO: should be giving some effective types here
export const Dropdown = ({ handleSelect, setIsOpen, isOpen, status }) => {

    const options = ["pending", "approved", "rejected"]
    return (
        <div className="relative  inline-block text-left text-black">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-48 px-4 py-2 text-left bg-white text-black rounded-lg shadow-xl focus:outline-none"
            >
                {status}
                <span className="float-right">
                    ▼
                </span>
            </button>

            {isOpen && (
                <ul className="absolute z-10 mt-1 w-48 bg-white text-black border rounded-lg shadow-lg">
                    {options.filter((option) => option != status).map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 cursor-pointer"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
