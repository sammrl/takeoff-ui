import React from 'react';
import styles from './ProjectCard.module.css';

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

interface ProjectCardProps {
  project: Project;
  tokenLogos: string[];
  isNew?: boolean;
}

// Function to format the age with appropriate precision
const formatAge = (timestamp: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  
  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Show only the most significant time unit
  if (days > 0) {
    // If more than a day, just show days
    return `${days}d`;
  } else if (hours > 0) {
    // If more than an hour but less than a day, just show hours
    return `${hours}h`;
  } else if (minutes > 0) {
    // If more than a minute but less than an hour, just show minutes
    return `${minutes}m`;
  } else {
    // If less than a minute, show seconds
    return `${seconds}s`;
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, tokenLogos, isNew = false }) => {
  return (
    <div className={`${styles.project_card} ${isNew ? styles.new_card : ''}`}>
      {/* Left side with name and logo */}
      <div className={styles.left_container}>
        <div className={styles.card_header}>
          <h3>{project.symbol}</h3>
        </div>
        <img
          className={styles.token_logo}
          src={tokenLogos[Math.floor(Math.random() * tokenLogos.length)]}
          alt={`${project.symbol} logo`}
        />
      </div>
      
      {/* Right side with data points */}
      <div className={styles.card_body}>
        <div className={styles.card_data}>
          <div className={styles.data_point}>
            <div className={styles.data_label}>Price</div>
            <div className={`${styles.data_value} ${styles.currency}`}>{project.price.toFixed(2)}</div>
          </div>
          <div className={styles.data_point}>
            <div className={styles.data_label}>Floor</div>
            <div className={`${styles.data_value} ${styles.currency}`}>{project.floor.toFixed(2)}</div>
          </div>
          <div className={styles.data_point}>
            <div className={styles.data_label}>Market Cap</div>
            <div className={`${styles.data_value} ${styles.currency}`}>{project.marketCap.toFixed(2)}</div>
          </div>
          <div className={styles.data_point}>
            <div className={styles.data_label}>Age</div>
            <div className={styles.data_value}>{formatAge(project.createdAt)}</div>
          </div>
          <div className={styles.data_point}>
            <div className={styles.data_label}>1H Change</div>
            <div className={`${styles.data_value} ${project.oneHourChange >= 0 ? styles.positive : styles.negative}`}>
              {project.oneHourChange.toFixed(2)}%
            </div>
          </div>
          <div className={styles.data_point}>
            <div className={styles.data_label}>24H Change</div>
            <div className={`${styles.data_value} ${project.dayChange >= 0 ? styles.positive : styles.negative}`}>
              {project.dayChange.toFixed(2)}%
            </div>
          </div>
          <div className={styles.data_point}>
            <div className={styles.data_label}>24H Volume</div>
            <div className={`${styles.data_value} ${styles.currency}`}>{project.volume.toFixed(2)}M</div>
          </div>
        </div>
      </div>
      
      {/* Add rank badge at the bottom of the card */}
      <div className={styles.rank_badge_container}>
        <div className={styles.rank_badge}>{project.rank}</div>
      </div>
    </div>
  );
};

export default ProjectCard; 