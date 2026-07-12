import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, Award, Code2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400 border border-${color}-500/20`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <span className="text-green-400 font-medium">{trend}</span>
        <span className="text-gray-500">vs last week</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, Alex! 👋</h1>
          <p className="text-gray-400">Here's your interview preparation progress.</p>
        </div>
        <Link to="/interviews" className="btn-primary flex items-center gap-2">
          <Target className="w-4 h-4" />
          Start Mock Interview
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall Readiness" value="0%" icon={Award} color="blue" />
        <StatCard title="Interviews Completed" value="0" icon={Target} color="purple" />
        <StatCard title="Practice Hours" value="0.0" icon={Clock} color="orange" />
        <StatCard title="DSA Score" value="0" icon={Code2} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Actions */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recommended for You</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'System Design: Rate Limiter', type: 'Video + Quiz', duration: '45 mins', icon: Cpu, color: 'blue' },
              { title: 'Dynamic Programming Practice', type: 'Coding', duration: '60 mins', icon: Code2, color: 'purple' },
              { title: 'Behavioral: Leadership Principles', type: 'AI Mock', duration: '30 mins', icon: Target, color: 'orange' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-${item.color}-500/20 text-${item.color}-400`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.type} • {item.duration}</p>
                  </div>
                </div>
                <Link to={item.type === 'Coding' ? '/coding' : '/interviews'} className="btn-secondary text-sm py-1.5 px-4 text-center rounded-lg flex items-center justify-center">Start</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Goals */}
        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Target Roles</h2>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Frontend Engineer</h3>
            <p className="text-gray-400 text-sm mb-4">Focus on React, JavaScript, and UI/UX design.</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[0%]" />
            </div>
            <p className="text-xs text-gray-500">0% Prepared</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
