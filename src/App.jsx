import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Registrar from './page/Registar'
import Client from './page/Client'
import ClientLogin from './page/ClientLogin'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import ViewRequest from './page/ViewRequest'
import TableRequest from './components/TableRequest'
import TableHistory from './components/TableHistory'
import TableAccounts from './components/TableAccounts'
import TableApproved from './components/TableApproved'
import TableReleased from './components/TableReleased'
import ClientViewRequest from './page/ClientViewRequest'
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
      <Route path='/' element={<Client onLogout={handleLogout} />}></Route>
      <Route path='view-request/:id' element={<ClientViewRequest />} />
      <Route path='/login' element={<ClientLogin />}></Route>
      <Route path='/registrar/login' element={<RegistrarLogin />}></Route>
      <Route path='/registrar' element={<Registrar />}>
        <Route path='view-request/:id' element={<ViewRequest />} />
        <Route path='' element={<TableRequest />} />
        <Route path='table' element={<TableRequest />} />
        <Route path='approved' element={<TableApproved />} />
        <Route path='released' element={<TableReleased />} />
        <Route path='history' element={<TableHistory />} />
        <Route path='accounts' element={<TableAccounts />} />
      </Route>
      
    </Routes>
  )
}

export default App
