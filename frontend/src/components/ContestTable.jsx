import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { PuffLoader } from 'react-spinners';
import './components.css';
import appTitle from '../constants/appTitle';

const ContestTable = () => {
    const [contests, setContests] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // New state for loading
    const contestsPerPage = 10;
    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset form and status
        setFormData({
            name: '',
            email: '',
            message: ''
        });
        setSubmitStatus(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/send-email`, formData);
            console.log('Email sent:', response.data);
            
            setSubmitStatus('success');
            setTimeout(() => {
                handleCloseModal();
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error sending email:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true); // Show loading spinner
            try {
                const response = await axios.get(`${backendURL}/api/contests`);
                // Parse contest_date as Date objects and sort
                const sortedData = response.data.sort((a, b) => {
                    const dateA = new Date(a.contest_date);
                    const dateB = new Date(b.contest_date);
                    return dateB - dateA; // Sort in ascending order
                });
                setContests(sortedData);
            } catch (error) {
                console.error('Error fetching contests:', error);
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };
        fetchContests();
    }, [backendURL]);

    const sortedContests = () => {
        if (!sortConfig.key) {
            return [...contests].sort((a, b) => new Date(b.contest_date) - new Date(a.contest_date));
        }
    
        return [...contests].sort((a, b) => {
            if (sortConfig.key === 'contest_date') {
                return new Date(b.contest_date) - new Date(a.contest_date);
            }
    
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredContests = sortedContests().filter(contest =>
        contest.contest_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * contestsPerPage;
    const currentContests = filteredContests.slice(offset, offset + contestsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <header className="header">
                <h1>{ appTitle }</h1>
                <h2>Leetcode Plagiarism Detector</h2>
            </header>

            <h1 className="h-class">Contest List</h1>

            <div className="page-container">
                <div className="home-button-container">
                    <button className="home-button">
                        <Link to="/" className="home-link">Home</Link>
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <PuffLoader color="#4A90E2" size={60} />
                        <p>Loading contests, please wait...</p>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search contest..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th onClick={() => requestSort('contest_name')}>Contest Name</th>
                                        <th onClick={() => requestSort('contest_date')}>Contest Date</th>
                                        <th>Contest Link</th>
                                        <th>Question 3</th>
                                        <th>Question 4</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentContests.map((contest) => (
                                        <tr key={contest._id}>
                                            <td>{contest.contest_name}</td>
                                            <td>{contest.contest_date}</td>
                                            <td>
                                                <a href={contest.contest_link} target="_blank" rel="noopener noreferrer">
                                                    View Contest
                                                </a>
                                            </td>
                                            <td>
                                                <Link to={`/questions/${contest.question_3}`}>Question 3</Link>
                                            </td>
                                            <td>
                                                <Link to={`/questions/${contest.question_4}`}>Question 4</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="records-info">
                            Displaying {offset + 1} to {Math.min(offset + contestsPerPage, filteredContests.length)} of {filteredContests.length} Records
                        </div>
                    </>
                )}
            </div>

            {!loading && (
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    pageCount={Math.ceil(filteredContests.length / contestsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                />
            )}

            <footer className="footer">
                <div className="social-links">
                    <a href="https://github.com/KaranKamath21" target="_blank" rel="noopener noreferrer">GitHub</a> |
                    <a href="https://www.linkedin.com/in/karan-kamath-a24b41227/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <p>
                    For any Query Regarding this Website: Drop a Message {' '}
                    <button 
                        onClick={handleOpenModal} 
                        className="contact-link"
                    >
                        HERE
                    </button>
                </p>
            </footer>

            {isModalOpen && (
                <div className="contact-modal-overlay" onClick={handleCloseModal}>
                    <div 
                        className="contact-modal" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-modal" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <h2>Contact Me</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            {submitStatus === 'success' && (
                                <div className="submit-status success">
                                    Message sent successfully!
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="submit-status error">
                                    Failed to send message. Please try again.
                                </div>
                            )}
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="submit-btn"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestTable;