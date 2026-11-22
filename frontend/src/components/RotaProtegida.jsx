import { Navigate } from 'react-router-dom';
import { pegarToken } from '../api.js';

export default function RotaProtegida({ children }) {
  if (!pegarToken()) return <Navigate to="/login" replace />;
  return children;
}