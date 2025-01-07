import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-2xl text-gray-600 mt-4">Página no encontrada</p>
                <Link href="/" className="mt-6 inline-block px-4 py-4 btn btn-primary text-white">
                    Gracias por pasar !
                </Link>
            </div>
        </div>
    );
};

export default NotFound;