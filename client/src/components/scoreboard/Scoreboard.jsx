import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function Scoreboard() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    axiosInstance.get('/user/leaderboard')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);

  return (
    <Card className="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Scoreboard 💪</h5>
        <Link to="#" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
          View all
        </Link>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {user.map((customer, index) => (
            <li className="py-3 sm:py-4" key={customer._id}>
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <img
                    alt={`${customer.name} image`}
                    src={customer.imageUrl}
                    className="rounded-full h-8 w-8"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{customer.username}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {customer.score}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default Scoreboard;