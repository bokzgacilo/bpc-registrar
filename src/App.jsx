import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Client from './page/Client'
import ClientLogin from './page/ClientLogin'
import { supabase } from './supabase'
import ViewRequest from './page/ViewRequest'
import TableRequest from './components/TableRequest'
import TableHistory from './components/TableHistory'
import TableAccounts from './components/TableAccounts'
import TableApproved from './components/TableApproved'
import TableReleased from './components/TableReleased'
import ClientViewRequest from './page/ClientViewRequest'
import Registrar from './page/Registar'
import RegistrarLogin from './page/RegistrarLogin'

function App() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      navigate('/login'); // Redirect to login after logout
    } else {
      console.log('Logout error:', error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Client onLogout={handleLogout} />} />
      <Route path="view-request/:id" element={<ClientViewRequest />} />
      <Route path="login" element={<ClientLogin />} />

      <Route path="registrar/login" element={<RegistrarLogin />} />
      <Route path="registrar" element={<Registrar />}>
        <Route index element={<TableRequest />} /> {/* Default route for "/registrar" */}
        <Route path="view-request/:id" element={<ViewRequest />} />
        <Route path="table" element={<TableRequest />} />
        <Route path="approved" element={<TableApproved />} />
        <Route path="released" element={<TableReleased />} />
        <Route path="history" element={<TableHistory />} />
        <Route path="accounts" element={<TableAccounts />} />
      </Route>
    </Routes>
  )
}

export default App
