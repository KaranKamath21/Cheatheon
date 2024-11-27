import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { PuffLoader } from 'react-spinners';
import './components.css';
import appTitle from '../constants/appTitle';

const QuestionPage = () => {
    const { questionId } = useParams();
    const [questionData, setQuestionData] = useState([]);
    const [threshold, setThreshold] = useState(50);
    const [inputThreshold, setInputThreshold] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [thresholdError, setThresholdError] = useState('');
    const [loading, setLoading] = useState(true); 
    const itemsPerPage = 10;
    const backendURL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendURL}/api/questions/${questionId}`);
                setQuestionData(response.data);
            } catch (error) {
                console.error('Error fetching question data:', error);
            } finally {
                setLoading(false); // Hide the loader
            }
        };

        fetchQuestionData();
    }, [questionId, backendURL]);

    useEffect(() => {
        setFilteredData(
            questionData.filter(record => {
                const matchesThreshold = record.confidence_score > threshold;
                const matchesSearch =
                    record.plagiarist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    record.plagiarized_from.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesThreshold && matchesSearch;
            })
        );
        setCurrentPage(0);
    }, [questionData, threshold, searchTerm]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentData = filteredData.slice(offset, offset + itemsPerPage);

    const handleThresholdInputChange = (event) => {
        setInputThreshold(event.target.value);
    };

    const handleApplyThreshold = () => {
        if (inputThreshold === undefined || inputThreshold === '') {
            setInputThreshold(50);
        }
        if (inputThreshold < 50) {
            setThresholdError('Minimum Threshold value is 50');
        } else {
            setThresholdError('');
            setThreshold(inputThreshold);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <header className="header">
                <h1>{appTitle}</h1>
                <h2>Leetcode Plagiarism Detector</h2>
            </header>

            <div className="page-container">
                <div className="home-button-container">
                    <Link to="/" className="home-link">
                        <button className="home-button">Home</button>
                    </Link>
                </div>

                <h1 className="h-class">Question {questionId} Details</h1>

                {loading ? (
                    <div className="loading-container">
                        <PuffLoader color="#4A90E2" size={60} /> {/* Loader animation */}
                        <p>Loading question data...</p>
                    </div>
                ) : (
                    <>
                        <div className="threshold-filter-container">
                            <div className="threshold-filter">
                                <input
                                    type="number"
                                    value={inputThreshold}
                                    onChange={handleThresholdInputChange}
                                    placeholder="Enter confidence threshold"
                                    min="0"
                                />
                                <button onClick={handleApplyThreshold}>Apply</button>
                            </div>
                            {thresholdError && <p className="threshold-error">{thresholdError}</p>}
                        </div>

                        <div className="search-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search by Plagiarist or Plagiarized From"
                            />
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Plagiarist</th>
                                        <th>Plagiarized From</th>
                                        <th>Plagiarist Rank</th>
                                        <th>Plagiarized Rank</th>
                                        <th>Confidence Score</th>
                                        <th>Language</th>
                                        <th>Plagiarist Sub ID</th>
                                        <th>Plagiarized Sub ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((record) => (
                                        <tr key={record._id}>
                                            <td>
                                                <a
                                                    href={`https://leetcode.com/u/${record.plagiarist_user_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {record.plagiarist}
                                                </a>
                                            </td>
                                            <td>
                                                <a
                                                    href={`https://leetcode.com/u/${record.plagiarized_from_user_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {record.plagiarized_from}
                                                </a>
                                            </td>
                                            <td>{record.plagiarist_rank}</td>
                                            <td>{record.plagiarized_rank}</td>
                                            <td>{record.confidence_score}</td>
                                            <td>{record.language}</td>
                                            <td>
                                                <a
                                                    href={`https://leetcode.com/submissions/detail/${record.plagiarist_submission_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {record.plagiarist_submission_id}
                                                </a>
                                            </td>
                                            <td>
                                                <a
                                                    href={`https://leetcode.com/submissions/detail/${record.plagiarized_submission_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {record.plagiarized_submission_id}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="records-info">
                                Displaying {offset + 1} to {Math.min(offset + itemsPerPage, filteredData.length)} of {filteredData.length} Records
                            </div>
                        </div>

                        <ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination__link"}
                            nextLinkClassName={"pagination__link"}
                            disabledClassName={"pagination__link--disabled"}
                            activeClassName={"pagination__link--active"}
                        />
                    </>
                )}
            </div>

            <footer className="footer">
                <div className="social-links">
                    <a href="https://github.com/KaranKamath21" target="_blank" rel="noopener noreferrer">GitHub</a> |
                    <a href="https://www.linkedin.com/in/karan-kamath-a24b41227/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <p>
                    For any Query Regarding this Website: Drop a Message at{' '}
                    <a href="https://www.linkedin.com/in/karan-kamath-a24b41227/" target="_blank" rel="noopener noreferrer">
                        Karan Kamath
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default QuestionPage;