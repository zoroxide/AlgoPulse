import React, { useEffect, useState } from 'react';
import Sheet from '../../components/cards/ImageHomeCards';
import axiosInstance from '../../utils/axiosInstance';
import './Sheets.css';

const Sheets = () => {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosInstance.get('/sheets')
            .then((response) => {
                setSheets(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch sheets data.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>error happend: {error}</div>;
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
        </div>
    );
};

export default Sheets;