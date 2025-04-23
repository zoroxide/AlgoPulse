import { useEffect, useState } from "react";
import Sheet from "../../components/cards/ImageHomeCards";
import HomeCard from "../../components/cards/HomeCard";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import "./Explore.css";
import axiosInstance from "../../utils/axiosInstance";
import { HR } from "flowbite-react";
import { ClipLoader } from "react-spinners";

function Explore() {
  const [sheets, setSheets] = useState([]);
  const [contests, setContests] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/sheets").then((response) => setSheets(response.data.slice(0, 3))),
      axiosInstance.get("/contests").then((response) => setContests(response.data.slice(0, 3))),
      axiosInstance.get("/blogs").then((response) => setBlogs(response.data.slice(0, 3))),
    ])
      .then(() => setLoading(false))
      .catch(() => {
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Something went wrong : {error}</div>;
  }

  return (
    <div className="explore-container">
      <div className="left-section">
        {/* Sheets Section */}
        <div className="sheets-section">
          <h1 className="sheets-title">🚴🏽‍♀️ Latest Sheets 🚴🏽‍♀️</h1>
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

        <HR></HR>

        {/* Contests Section */}
        <div className="contests-section">
          <h1 className="sheets-title">⚔️ Latest Contests ⚔️</h1>
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

        <HR></HR>

        {/* Latest Blogs Section */}
        <div className="blogs-section">
          <h1 className="sheets-title">📝 Latest Blogs 📝</h1>
          <br />
          {blogs.length === 0 ? (
            <div>No blogs available.</div>
          ) : (
            blogs.map((blog) => (
              <HomeCard
                key={blog._id}
                title={blog.title}
                content={blog.content}
                link={`/blog/${blog._id}`}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <Scoreboard />
      </div>
    </div>
  );
}

export default Explore;