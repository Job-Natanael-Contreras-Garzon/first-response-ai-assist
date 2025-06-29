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
    <div className="full-height bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100 text-slate-700 overflow-hidden">
      {/* Main Content */}
      <main className={hasBottomNav ? 'container-with-nav-safe' : 'full-height'}>
        <div className="max-w-lg mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveLayout;
