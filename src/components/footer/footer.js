import React from 'react';

export default function Footer(){
  return (
    <footer className="bg-primary text-white text-center py-4 mt-4">
      <p className="text-sm">
        Proyecto desarrollado por Rodrigo Mardones A. &copy; {new Date().getFullYear()}.
      </p>
    </footer>
  );
};
