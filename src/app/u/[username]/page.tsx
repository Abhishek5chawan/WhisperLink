import React from 'react';

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
      <div className="text-center p-6 bg-white bg-opacity-10 rounded-lg shadow-lg max-w-md text-lg md:text-xl font-semibold text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <p className="mb-4">
          This link is provided by the Mystery Message app. If you're new to this app, please register{' '}
          <a href="/sign-up" className="text-blue-200 hover:text-blue-400 underline">
            here
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Page;
