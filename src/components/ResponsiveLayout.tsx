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
    <div className="min-h-screen bg-black text-white">
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
