import React, { useState, useEffect, useContext } from 'react'
import { Button, CloseButton, Container, DropdownButton } from 'react-bootstrap'
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();
    const [year, setYear] = useState<string|number>("per Year")

    const buildOptions= () => {
      var arr = [];

      for (var i = 2022; i > 1950; i--) {
          arr.push(i)
      }

      return arr; 
  }
  

  const resetYear = () => setYear("per Year")

  return (
    <Container>
        <Container className='header'></Container>
        <Container className='navigation'>
            <h1>Movie ranking</h1>
            <Button variant="outline-secondary" onClick={() => {resetYear(); navigate('/')}} active={window.location.pathname=="/"}>All movies</Button>
            <Button variant="outline-secondary" onClick={() => {resetYear(); navigate('topMovies')}}active={window.location.pathname=="/topMovies"}>Top 10 Revenue</Button>
            <DropdownButton variant={(window.location.pathname==("/topMoviesYear"))? "secondary" : "outline-secondary"} title={"Top 10 Revenue " + year}>
              {
                buildOptions().map((year) => (
                  <DropdownItem onClick={() => {setYear(year); navigate('topMoviesYear', {state: {year: year}})}}>{year}</DropdownItem>
                ))
              }
            </DropdownButton>
        </Container>
    </Container>
  )
}

export default Navbar