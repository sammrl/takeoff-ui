import React, { useState, useEffect } from 'react';
import './ProjectPage.css';
import takeoffLogo from './assets/takeoff-logo.png';
import meme21 from './assets/meme21.jpeg';
import meme22 from './assets/meme22.png';
import meme23 from './assets/meme23.jpeg';
import meme24 from './assets/meme24.jpeg';
import meme25 from './assets/meme25.jpeg';
import meme26 from './assets/meme26.png';
import ProjectCard from './components/ProjectCard';

interface Project {
  rank: number;
  symbol: string;
  price: number;
  floor: number;
  marketCap: number;
  tape: string;
  createdAt: Date;
  oneHourChange: number;
  dayChange: number;
  volume: number;
}

// Array of token logos (6 images)
const tokenLogos = [meme21, meme22, meme23, meme24, meme25, meme26];

const ProjectsPage = () => {
  const [orderBy, setOrderBy] = useState("Market Cap");
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const [newCardId, setNewCardId] = useState<number | null>(null);
  
  // Initial projects data without rank (will be assigned by marketCap)
  const initialProjectsData = [
    { 
      symbol: "MOON", 
      price: 1234.56, 
      floor: 1100.0, 
      marketCap: 15000, 
      tape: "1.2340", 
      createdAt: new Date(), // Just created (0 seconds ago)
      oneHourChange: 0.00,
      dayChange: 0.00,
      volume: 147.72
    },
    { 
      symbol: "STAR", 
      price: 987.65, 
      floor: 950.0, 
      marketCap: 13000, 
      tape: "0.9870", 
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      oneHourChange: -0.12,
      dayChange: -0.58,
      volume: 98.45
    },
    { 
      symbol: "LUNA", 
      price: 45.67, 
      floor: 44.44, 
      marketCap: 12000, 
      tape: "0.4560", 
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      oneHourChange: 1.45,
      dayChange: -2.30,
      volume: 78.52
    },
    { 
      symbol: "NEO", 
      price: 0.89, 
      floor: 0.88, 
      marketCap: 1000, 
      tape: "0.1000", 
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      oneHourChange: -0.75,
      dayChange: 1.20,
      volume: 32.18
    }
  ];

  // Generate additional 95 projects without ranks
  const generateAdditionalProjects = () => {
    // Generate random symbol
    const generateRandomSymbol = () => {
      const length = Math.floor(Math.random() * 3) + 3; // 3-5 characters
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };
    
    return Array.from({ length: 95 }, () => {
      return {
        symbol: generateRandomSymbol(),
        price: parseFloat((Math.random() * 1000 + 1).toFixed(2)),
        floor: parseFloat((Math.random() * 1000 + 1).toFixed(2)),
        marketCap: parseFloat((Math.random() * 10000 + 1000).toFixed(2)),
        tape: (Math.random()).toFixed(4),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        oneHourChange: parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
        dayChange: parseFloat((Math.random() * 10 - 5).toFixed(2)),
        volume: parseFloat((Math.random() * 200 + 50).toFixed(2))
      };
    });
  };

  // Assign ranks based on marketCap
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  
  useEffect(() => {
    // Combine initial and additional projects
    const allProjects = [...initialProjectsData, ...generateAdditionalProjects()];
    
    // Sort by marketCap in descending order and assign ranks
    const rankedProjects = allProjects
      .sort((a, b) => b.marketCap - a.marketCap)
      .map((project, index) => ({
        ...project,
        rank: index + 1
      }));
    
    setProjectsData(rankedProjects);
  }, []);
  
  // Generate a random project for the Create button
  const generateRandomProject = () => {
    // Generate random symbol
    const generateRandomSymbol = () => {
      const length = Math.floor(Math.random() * 3) + 3; // 3-5 characters
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };
    
    // Create a random timestamp within the last 30 days
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const randomHoursAgo = Math.floor(Math.random() * 24);
    const randomMinutesAgo = Math.floor(Math.random() * 60);
    const randomSecondsAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - randomDaysAgo);
    timestamp.setHours(timestamp.getHours() - randomHoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - randomMinutesAgo);
    timestamp.setSeconds(timestamp.getSeconds() - randomSecondsAgo);
    
    const newProject = {
      symbol: generateRandomSymbol(),
      price: Math.floor(Math.random() * 1000) + 100 + Math.random(),
      floor: Math.floor(Math.random() * 800) + 100 + Math.random(),
      marketCap: Math.floor(Math.random() * 20000) + 1000,
      tape: (Math.random() * 2).toFixed(4),
      createdAt: timestamp,
      oneHourChange: (Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1),
      dayChange: (Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1),
      volume: Math.floor(Math.random() * 500) + 50 + Math.random()
    };
    
    return newProject;
  };

  // Handle create button click
  const handleCreateClick = () => {
    const newProject = generateRandomProject();
    
    // Combine the new project with existing ones and re-sort by marketCap
    const updatedProjects = [...projectsData, newProject]
      .sort((a, b) => b.marketCap - a.marketCap)
      .map((project, index) => ({
        ...project,
        rank: index + 1
      }));
    
    // Find the rank of the new project after sorting
    const addedProject = updatedProjects.find(p => 
      p.symbol === newProject.symbol && 
      p.createdAt === newProject.createdAt
    );
    
    setProjectsData(updatedProjects);
    setNewCardId(addedProject?.rank || null);
    
    // Reset the new card ID after animation completes
    setTimeout(() => {
      setNewCardId(null);
    }, 2000);
  };

  // Sorting logic
  const sortedProjects = [...projectsData].sort((a, b) => {
    let comparison = 0;
    
    if (orderBy === "Market Cap") {
      comparison = b.marketCap - a.marketCap;
    } else if (orderBy === "Price") {
      comparison = b.price - a.price;
    } else if (orderBy === "Floor") {
      comparison = b.floor - a.floor;
    } else if (orderBy === "Age") {
      // Sort by timestamp - newer projects first when descending
      comparison = a.createdAt.getTime() - b.createdAt.getTime();
    }
    
    // Reverse comparison if ascending
    return sortDirection === "asc" ? -comparison : comparison;
  });

  // Update ranks after any sort
  const sortedProjectsWithUpdatedRanks = sortedProjects.map((project, index) => ({
    ...project,
    rank: index + 1
  }));

  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(event.target.value);
    setCurrentPage(1); // Reset to first page when changing order
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setCurrentPage(1); // Reset to first page when changing sort direction
  };

  // Pagination: calculate current page projects (20 per page)
  const itemsPerPage = 20;
  const totalPages = Math.ceil(sortedProjectsWithUpdatedRanks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjectsWithUpdatedRanks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="projects-page">
      <header className="header">
        <img src={takeoffLogo} alt="Takeoff Logo" className="header-logo" />
        <div className="header-left">
          <button className="create-button" onClick={handleCreateClick}>Create</button>
        </div>
        <div className="header-center">
          <div className="order-by">
            <label htmlFor="order-select">Order By:</label>
            <select id="order-select" value={orderBy} onChange={handleOrderChange}>
              <option value="Market Cap">Market Cap</option>
              <option value="Floor">Floor</option>
              <option value="Price">Price</option>
              <option value="Age">Age</option>
            </select>
            <button 
              className={`sort-direction-toggle ${sortDirection === "desc" ? "descending" : ""}`}
              onClick={toggleSortDirection}
              aria-label={`Sort ${sortDirection === "asc" ? "Descending" : "Ascending"}`}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polyline points="6 15 12 9 18 15"></polyline>
              </svg>
              <span className="sort-direction-text">{sortDirection === "desc" ? "↓" : "↑"}</span>
            </button>
          </div>
          <div className="status-label">LIVE OFF (soon)</div>
        </div>
        <div className="header-right">
          <button className="wallet-button">Select Wallet</button>
        </div>
      </header>
      <main className="content">
        <div className="projects-cards">
          {currentProjects.map((project) => (
            <ProjectCard 
              key={`${project.rank}-${currentPage}`}
              project={project} 
              tokenLogos={tokenLogos} 
              isNew={project.rank === newCardId}
            />
          ))}
        </div>
        <div className="pagination" style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;