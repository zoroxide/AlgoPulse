import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

function Scoreboard() {
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
          {[
            {
              name: "Loay Mohamed",
              email: "loay",
              amount: "3467",
              imageUrl: "https://avatars.githubusercontent.com/u/72279810?v=4"
            },
            {
              name: "Bonnie Green",
              email: "bonnie_",
              amount: "3337",
              imageUrl: "https://avatars.githubusercontent.com/u/72279810?v=4"
            },
            {
              name: "Michael Gough",
              email: "gough_m",
              amount: "367",
              imageUrl: "https://assets.leetcode.com/users/zoroxide/avatar_1710946534.png"
            },
            {
              name: "Lana Byrd",
              email: "lbyrd",
              amount: "320",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8CeQPcq9-PgH7GFXIGyfispzQ6WIKAxxIdw&s"
            },
            {
              name: "Thomas Lean",
              email: "yop_thomas",
              amount: "67",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8CeQPcq9-PgH7GFXIGyfispzQ6WIKAxxIdw&s"
            }
          ].map((customer, index) => (
            <li className="py-3 sm:py-4" key={index}>
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
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {customer.amount}
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
