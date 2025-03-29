import React from "react";
import PropTypes from "prop-types";

const AchievementsBar = ({ solvedCount, totalProblems }) => {
  const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

  return (
    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6 shadow-md">
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Achievements</h2>
      <p className="text-lg text-blue-700">
        Solved Problems:{" "}
        <span className="font-bold">
          {solvedCount} / {totalProblems}
        </span>
      </p>
      <div className="w-full bg-blue-200 rounded-full h-4 mt-2">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{
            width: `${progressPercentage}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

AchievementsBar.propTypes = {
  solvedCount: PropTypes.number.isRequired,
  totalProblems: PropTypes.number.isRequired,
};

export default AchievementsBar;