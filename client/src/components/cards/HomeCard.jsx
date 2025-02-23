import { Button, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';

export default function HomeCard({ title, content, link, contestId, isUpcoming, isRunning, isCompleted }) {
  const [contest, setContest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axiosInstance.get(`/contests/${contestId}`);
        setContest(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Contest not found. Please check the contest ID.');
        } else {
          setError('Failed to load the contest. Please try again later.');
        }
        console.error('Error fetching contest:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  const handleReadMoreClick = () => {
    if (isRunning || isCompleted) {
      navigate(link);
    } else {
      alert(`Contest will start at ${new Date(contest.startTime).toLocaleString()} and ends at ${new Date(contest.endTime).toLocaleString()}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentTime = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  return (
    <Card className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {content}
      </p>
      {isUpcoming ? (
        <div className="font-normal text-gray-700 dark:text-gray-400">
          Contest will start at {startTime.toLocaleString()} and ends at {endTime.toLocaleString()}
          <br />
          <Button>Register Now</Button>
        </div>
      ) : (
        <Button onClick={handleReadMoreClick}>
          {isRunning || isCompleted ? "Read more" : "Register"}
          <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}
    </Card>
  );
}