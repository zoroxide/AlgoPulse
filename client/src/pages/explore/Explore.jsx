import { useEffect, useState } from "react";
import Sheet from "../../components/cards/ImageHomeCards";
import HomeCard from "../../components/cards/HomeCard";
import BlogPost from "../../components/cards/BlogPost";
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

  const currentTime = new Date();

  const upcomingContests = contests.filter(
    (contest) => new Date(contest.startTime) > currentTime
  );
  const runningContests = contests.filter(
    (contest) =>
      new Date(contest.startTime) <= currentTime &&
      new Date(contest.endTime) >= currentTime
  );
  const completedContests = contests.filter(
    (contest) => new Date(contest.endTime) < currentTime
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sheetsRes, contestsRes, blogsRes] = await Promise.allSettled([
          axiosInstance.get("/sheets"),
          axiosInstance.get("/contests"),
          axiosInstance.get("/blogs"),
        ]);

        if (sheetsRes.status === "fulfilled") {
          console.log("Sheets data:", sheetsRes.value.data);
          setSheets(sheetsRes.value.data.slice(0, 2));
        }

        if (contestsRes.status === "fulfilled") {
          console.log("Contests data:", contestsRes.value.data);
          setContests(contestsRes.value.data.slice(0, 2));
        }

        if (blogsRes.status === "fulfilled") {
          console.log("Blogs data:", blogsRes.value.data);
          setBlogs(blogsRes.value.data.slice(0, 2));
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <h1 className="sheets-title">Latest Sheets 🚴🏽‍♀️</h1>
          {sheets.length === 0 ? (
            <div>No sheets available.</div>
          ) : (
            <div className="sheets-cards">
              {sheets.map((sheet) => (
                <Sheet
                  key={sheet._id}
                  title={sheet.name}
                  content={sheet.content}
                  img={sheet.img}
                  sheetId={sheet._id}
                />
              ))}
            </div>
          )}
        </div>

        <HR></HR>

        {/* Contests Section */}
        <div className="contests-section">
          <div className="sheets-section">
            <h1 className="sheets-title">Latest Contests ⚔️</h1>

            {runningContests.length > 0 && (
              <>
                <h1 className="sheets-subtitle">Running Now</h1>
                {runningContests.map((contest) => (
                  <HomeCard
                    key={contest._id}
                    title={contest.name}
                    content={contest.description}
                    link={`/contest/${contest._id}`}
                    contestId={contest._id}
                    isRunning={true}
                  />
                ))}
              </>
            )}
            {upcomingContests.length > 0 && (
              <>
                <h1>Upcoming Contests</h1>
                {upcomingContests.map((contest) => (
                  <HomeCard
                    key={contest._id}
                    title={contest.name}
                    content={contest.description}
                    link={`/contest/${contest._id}`}
                    contestId={contest._id}
                    isUpcoming={true}
                  />
                ))}
              </>
            )}
            {completedContests.length > 0 && (
              <>
                <h1>Completed Contests</h1>
                {completedContests.map((contest) => (
                  <HomeCard
                    key={contest._id}
                    title={contest.name}
                    content={contest.description}
                    link={`/contest/${contest._id}`}
                    contestId={contest._id}
                    isCompleted={true}
                  />
                ))}
              </>
            )}
            {contests.length === 0 && <Alert>No Contests available</Alert>}
          </div>
        </div>

        <HR></HR>

        {/* Latest Blogs Section */}
        <div className="blogs-section">
          <h1 className="sheets-title">Latest Blogs 📝</h1>
          {blogs.length === 0 ? (
            <div>No blogs available.</div>
          ) : (
            blogs.map((blog) => (
              <BlogPost
                key={blog._id}
                blog={blog}
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