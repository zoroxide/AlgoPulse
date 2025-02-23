import { useEffect, useState } from "react";
import Sheet from "../../components/cards/ImageHomeCards";
import HomeCard from "../../components/cards/HomeCard";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import "./Explore.css";
import axiosInstance from "../../utils/axiosInstance";

function Explore() {
  const [sheets, setSheets] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/sheets")
      .then((response) => {
        setSheets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch sheets data.");
        setLoading(false);
      });
    axiosInstance
      .get("/contests")
      .then((response) => {
        setContests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch contests data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="explore-container">
      <div className="left-section">
        <div className="sheets-section">
          <h1 className="sheets-title">Roadmaps (sheets) 🚴🏽‍♀️</h1>
          <br />
          {sheets.length === 0 ? (
            <div>No sheets available.</div>
          ) : (
            sheets.map((sheet) => (
              <Sheet
                key={sheet._id}
                title={sheet.name}
                content={sheet.content}
                img={sheet.img}
                sheetId={sheet._id}
              />
            ))
          )}
        </div>
        <div className="contests-section">
          <h1 className="sheets-title">Contests ☠️</h1>
          <br />
          {contests.length === 0 ? (
            <div>No upcoming or running contests available.</div>
          ) : (
            contests.map((contest) => (
              <HomeCard
                key={contest._id}
                title={contest.name}
                content={contest.content}
                link={`/contest/${contest._id}`}
              />
            ))
          )}
        </div>
      </div>
      <div className="right-section">
        <Scoreboard />
      </div>
    </div>
  );
}

export default Explore;