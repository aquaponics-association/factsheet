import * as React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import ListComponent from './components/ListComponent';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import ViewComponent from './components/ViewComponent';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Switch>
        <Route path='/' exact>
          <ListComponent />
        </Route>
        <Route path='/fact/:id'>
          <ViewComponent />
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>
);
