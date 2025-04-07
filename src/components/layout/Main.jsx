import React from 'react';

const Main = ({ children }) => {
  return (
    <main className="bg-white py-4 flex-grow">
      {children}
    </main>
  );
};

export default Main; 