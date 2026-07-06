import React from "react";
import { Users as UsersIcon, Database, Zap, TrendingUp } from "lucide-react";

function StatsGrid({ totalUsers, isOffline, latency = 0 }) {
  const stats = [
    {
      title: "Total Registered Users",
      value: isOffline ? "--" : totalUsers,
      label: "Active members in MySQL",
      icon: UsersIcon,
      trend: "+8.4% monthly",
      trendType: "up",
    },
    {
      title: "Database System",
      value: isOffline ? "Offline" : "MySQL 8.0",
      label: "Dockerized DB Instance",
      icon: Database,
      trend: "Connected",
      trendType: isOffline ? "down" : "neutral",
    },
    {
      title: "API Network Latency",
      value: isOffline ? "--" : `${latency} ms`,
      label: "Average request roundtrip",
      icon: Zap,
      trend: isOffline ? "Unreachable" : "Optimal Speed",
      trendType: isOffline ? "down" : "up",
    },
    {
      title: "Weekly Enrollment",
      value: isOffline ? "--" : Math.ceil(totalUsers * 0.15),
      label: "New accounts added",
      icon: TrendingUp,
      trend: "Calculated average",
      trendType: "neutral",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div key={idx} className="glass-card">
            <div className="stat-card-header">
              <span className="stat-label">{stat.title}</span>
              <div className="stat-icon-wrapper">
                <IconComponent size={20} />
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label" style={{ marginTop: "4px", fontSize: "0.8rem" }}>
              {stat.label}
            </div>
            <div className={`stat-trend ${
              stat.trendType === "up" ? "trend-up" : 
              stat.trendType === "down" ? "trend-down" : "trend-neutral"
            }`}>
              {stat.trend}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;
