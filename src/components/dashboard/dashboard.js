import React, { useState } from 'react';
import { Button, Card } from 'react-daisyui';

function Dashboard({ children }) {
  const [active, setActive] = useState('home');

  return (
    <div className="flex h-screen bg-gray-100">
      <Card className="w-64 bg-indigo-700 text-white p-4">
        <Button onClick={() => setActive('home')} color={active === 'home' ? 'indigo' : 'gray'} fullWidth>
          Home
        </Button>
        <Button onClick={() => setActive('settings')} color={active === 'settings' ? 'indigo' : 'gray'} fullWidth>
          Settings
        </Button>
        <Button onClick={() => setActive('profile')} color={active === 'profile' ? 'indigo' : 'gray'} fullWidth>
          Profile
        </Button>
      </Card>
      <div className="flex-grow p-4 overflow-auto">
        {active === 'home' && <div>Home content</div>}
        {active === 'settings' && <div>Settings content</div>}
        {active === 'profile' && <div>Profile content</div>}
        {children}
      </div>
    </div>
  );
}

export default Dashboard;