import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job, onApply }) => {
  return (
    <div className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">{job.title}</h3>
        <p className="text-gray-300 dark:text-gray-700">{job.company}</p>
        <p className="text-gray-400 dark:text-gray-600">{job.location} - {job.jobType}</p>
        <p className="text-gray-400 dark:text-gray-600">Hourly Rate: ${job.hourlyRate}</p>
        <div className="mt-4 flex space-x-4">
          <Link
            to={`/job/${job._id}`}
            className="text-indigo-400 dark:text-indigo-600 hover:underline"
          >
            View Details
          </Link>
          {onApply && (
            <Link
              to={`/apply/${job._id}`}
              className="text-indigo-400 dark:text-indigo-600 hover:underline"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;