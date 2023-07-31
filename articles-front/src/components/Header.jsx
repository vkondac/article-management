import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-500 py-4">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          <div className="text-white font-semibold text-xl">
            Articles Management
          </div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/article">Articles</Link>
            </li>
            <li>
              <Link to="/category">Categories</Link>

            </li>
            <li>
              <Link to="/tag">Tags</Link>

            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
