import React from 'react';
import '../styles/app.scss';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import CoinList from './CoinList';
import CoinDetailsView from './CoinDetailsView';
import netdata from '../styles/icons/netdata.png';

const App = () => {
  return (
    <div>
      <header className="app-header">
        <a href="https://www.netdata.cloud/">
          <img src={netdata} className="app-logo" />
        </a>        
      </header>
      <Container maxWidth="lg">
        <BrowserRouter>
          <Route path="/" exact component={CoinList} />
          <Route 
            path="/:id" 
            exact 
            component={CoinDetailsView} />
        </BrowserRouter>
      </Container>
    </div>
  );
};

export default App;
