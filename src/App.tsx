import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { MovieDto } from './model';
import axios from "axios";
import {Table} from 'react-bootstrap';
import MoviesComponent from './component/MoviesComponent';
import Navbar from './component/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopMovieComponent from './component/TopMovieComponent';

function App() {


  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path='/' element={<MoviesComponent />} />
          <Route key="top-movies" path='/topMovies' element={<TopMovieComponent />} />
          <Route key="top-movies-per-year" path='/topMoviesYear' element={<TopMovieComponent />} />
        </Routes>  
    </Router>
  );
}

export default App;
