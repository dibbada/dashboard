import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bento-item h-full flex flex-col justify-center items-center"
    >
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-6xl font-light tracking-tight text-foreground">
            {formatNumber(displayHours)}
          </span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl font-light text-primary"
          >
            :
          </motion.span>
          <span className="text-6xl font-light tracking-tight text-foreground">
            {formatNumber(minutes)}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-lg text-muted-foreground font-light">
            {formatNumber(seconds)}
          </span>
          <span className="text-sm font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10">
            {ampm}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {time.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default ClockWidget;
