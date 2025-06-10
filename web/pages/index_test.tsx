import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <>
      <Head>
        <title>Scoop - Social Verification</title>
        <meta name="description" content="Scoop - Your trusted social verification platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00BCD4" />
      </Head>
      
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl relative rounded-3xl flex flex-col" style={{width: '430px', height: '932px'}}>
          <div className="p-4">
            <h1>Test Page</h1>
            <p>If you see this, the syntax is working.</p>
          </div>
        </div>
      </div>
    </>
  );
}