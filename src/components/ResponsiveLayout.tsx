import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  hasBottomNav?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  hasBottomNav = false 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100 text-slate-700">
      {/* Main Content */}
      <main className={`min-h-screen ${hasBottomNav ? 'pb-safe' : ''}`}>
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveLayout;
