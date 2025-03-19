
import React from 'react';
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon, className }) => {
  return (
    <div className={cn(
      "p-6 rounded-xl glass-card transition-all duration-300 hover:shadow-md",
      "hover:translate-y-[-2px] hover:bg-white/80",
      className
    )}>
      <div className="w-12 h-12 rounded-lg bg-primary/10 mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default InfoCard;
