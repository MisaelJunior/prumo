import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('...');
  useEffect(() => {
    fetch('/api/saude').then(r => r.json()).then(d => setStatus(d.status));
  }, []);
  return <h1>Prumo — API: {status}</h1>;
}