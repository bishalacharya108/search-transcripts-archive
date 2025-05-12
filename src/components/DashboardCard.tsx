import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import { describe } from "node:test";
import React from "react";

const DashboardCard = ({transcript}) => {
    const {title, markdown} = transcript;
  return (
    <div>
      <div className="card w-[50rem] bg-base-100 card-md shadow-sm mx-auto">
        <div className="card-body">
          <h2 className="card-title">Title: {title}</h2>
          <p className="line-clamp-4">
            {markdown.length > 500 ? `${markdown.slice(0, 500)}...` : markdown} 
          </p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">Expand</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
