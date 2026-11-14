import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('...');
  const API = import.meta.env.VITE_API_URL ?? '';
  useEffect(() => {
    fetch(`${API}/api/saude`);
  }, []);
  return <h1>Prumo — API: {status}</h1>;
}