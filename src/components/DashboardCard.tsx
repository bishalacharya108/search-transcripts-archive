import Link from "next/link";
import React from "react";

const DashboardCard = ({ transcript, approved = false }) => {
    const { title, markdown, _id, status } = transcript;

    return (
        <div>
            <div className="card w-[50rem] bg-base-100 border-b card-md shadow-lg mx-auto rounded-none">
                <div className="card-body pt-2 pb-1">
                    <h2 className="card-title">Title: {title}</h2>
                    <p className="line-clamp-4">
                        {markdown.length > 500 ? `${markdown.slice(0, 500)}...` : markdown}
                    </p>
                    <div>

                    </div>

                    <div className="justify-end card-actions">
                        {/*sending approved status as query*/}
                        {/*TODO: add effect for loading expand*/}
                        <Link href={{ pathname: `/dashboard/${_id}`, query: { approved } }}>
                            <button className="btn btn-info text-white">Expand</button>

                            </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
