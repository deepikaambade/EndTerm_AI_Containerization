
import React from 'react';

interface StatProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

const Stat: React.FC<StatProps> = ({ label, value, change, isPositive = true }) => {
  return (
    <div className="p-6 rounded-xl glass-card transition-all duration-300 hover:shadow-md">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      {change && (
        <p className={`text-xs font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {change}
        </p>
      )}
    </div>
  );
};

const Statistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Stat 
        label="Noise Reduction" 
        value="98.2%" 
        change="3.1% increase" 
        isPositive={true} 
      />
      <Stat 
        label="Audio Quality" 
        value="95.7%" 
        change="2.4% increase" 
        isPositive={true} 
      />
      <Stat 
        label="Processing Time" 
        value="0.8s" 
        change="0.3s decrease" 
        isPositive={true} 
      />
      <Stat 
        label="File Size" 
        value="2.1MB" 
        change="15% reduction" 
        isPositive={true} 
      />
    </div>
  );
};

export default Statistics;
