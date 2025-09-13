import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Activity } from 'lucide-react';

interface InteractiveDashboardProps {
  className?: string;
}

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  color: string;
  delay: number;
}> = ({ icon, title, value, change, color, delay }) => (
  <motion.div
    className={`card-aesthetic p-6 relative overflow-hidden group cursor-pointer`}
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ 
      scale: 1.05, 
      y: -5,
      transition: { duration: 0.2 }
    }}
    transition={{ duration: 0.5, delay }}
  >
    {/* Animated background gradient */}
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.1, 0.2, 0.1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className="p-3 rounded-xl bg-white/10"
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <motion.span
          className="text-sm font-medium text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {change}
        </motion.span>
      </div>
      
      <motion.h3
        className="text-lg font-medium text-gray-300 mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.1 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-3xl font-bold text-white"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.p>
    </div>
  </motion.div>
);

const AnimatedChart: React.FC = () => (
  <motion.div
    className="card-aesthetic p-6 relative overflow-hidden"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
  >
    <motion.h3
      className="text-xl font-bold text-white mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      Activity Overview
    </motion.h3>
    
    <div className="flex items-end space-x-3 h-32">
      {[40, 70, 45, 80, 60, 90, 55].map((height, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg relative overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ 
            duration: 0.6, 
            delay: 1.2 + i * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.1,
            filter: "brightness(1.2)"
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 2 + i * 0.1
            }}
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MetricCard
        icon={<Sparkles className="h-6 w-6 text-yellow-400" />}
        title="Active Projects"
        value="24"
        change="+12%"
        color="from-yellow-500 to-orange-500"
        delay={0.1}
      />
      
      <MetricCard
        icon={<Zap className="h-6 w-6 text-blue-400" />}
        title="Tasks Completed"
        value="156"
        change="+8%"
        color="from-blue-500 to-cyan-500"
        delay={0.2}
      />
      
      <MetricCard
        icon={<TrendingUp className="h-6 w-6 text-green-400" />}
        title="Team Efficiency"
        value="94%"
        change="+5%"
        color="from-green-500 to-emerald-500"
        delay={0.3}
      />
      
      <MetricCard
        icon={<Activity className="h-6 w-6 text-purple-400" />}
        title="Weekly Hours"
        value="42.5"
        change="+3%"
        color="from-purple-500 to-pink-500"
        delay={0.4}
      />
      
      <motion.div
        className="md:col-span-2 lg:col-span-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <AnimatedChart />
      </motion.div>
    </motion.div>
  );
};
