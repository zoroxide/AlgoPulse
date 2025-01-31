import { useEffect, useState } from "react";
import Sheet from "../../components/cards/ImageHomeCards";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import "./Explore.css";
import axiosInstance from "../../utils/axiosInstance";

function Explore() {
    const [sheets, setSheets] = useState([]); // To store sheets data from backend
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // To handle any errors during the fetch

    useEffect(() => {
        // Fetch sheets data from the backend
        axiosInstance.get('/sheets')
            .then((response) => {
                setSheets(response.data); // Assuming the backend returns an array of sheets
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch sheets data.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading indicator
    }

    if (error) {
        return <div>{error}</div>; // Error message if the fetch fails
    }

    return (
        <div className="explore-container">
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
            <div className="scoreboard-section">
                <Scoreboard />
            </div>
        </div>
    );
}

export default Explore;
