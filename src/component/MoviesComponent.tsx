import React, {useEffect, useState, useRef, useMemo, Ref} from 'react';
import axios from "axios";
import {Table, Container, Modal, Button, Form, FormGroup, CloseButton, Dropdown, DropdownButton} from 'react-bootstrap';
import { ActorDto, DirectorDto, GenreDto, MovieDetailsDto, MovieDto } from '../model';
import { AiFillEye, AiFillEdit, AiFillDelete } from 'react-icons/ai';
import InfiniteScroll from './InfiniteScroll';
import { BASE_API } from '../constants';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const MoviesComponent: React.FC = () => {
    const [movies, setMovies] = useState<MovieDto[]>([])
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(10)
    const [loading, setLoading] = useState(false);
    const [last, setLast] = useState(false)
    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false)
    const [showError, setShowError] = useState(false);
    const [movie, setMovie] = useState<MovieDetailsDto>(
        {
            id: "test",
            title: "test",
            date: "test",
            rating: 0,
            revenue: 0,
            genres: [{id: 0,
                name: "string"}],
            actors: [{id: 0,
                fullName: "string"}],
            director: {id: 0,
                fullName: "string"},
            runtime: 0,
            votes: 0,
            description: "test",
        }
    )
    const [error, seterror] = useState("")

    const hasMoreData = !last;

    const mockActors : ActorDto[] = [{"id": 1, "fullName":"John Johnson"},{"id": 2, "fullName":"James Jameson"}, {"id": 3, "fullName":"Anna Smith"}, {"id": 4, "fullName":"Peter Parker"}, {"id": 5, "fullName":"John Ceena"}, {"id": 6, "fullName":"Luke Skywalker"}, {"id": 7, "fullName":"Harry Potter"}, {"id": 8, "fullName":"Tony Stark"}, {"id": 9, "fullName":"Bruce Wayne"}, {"id": 10, "fullName":"Bruce Banner"}, {"id": 11, "fullName":"Albus Dumbledore"}, {"id": 12, "fullName":"Sirius Black"}, {"id": 13, "fullName":"Hermione Granger"}]
    const mockGenres : GenreDto[] = [{"id": 1, "name":"horror"}, {"id": 2, "name":"romance"}, {"id": 3, "name":"sci-fi"}, {"id": 4, "name":"fantasy"}, {"id": 5, "name":"drama"}, {"id": 6, "name":"comedy"}]
    const mockDirectors: DirectorDto[] = [{"id": 1, "fullName":"Ron Weasley"},{"id": 2, "fullName":"Sherlock Holmes"}, {"id": 3, "fullName":"James Potter"}, {"id": 4, "fullName":"Severus Snape"}, {"id": 5, "fullName":"Gilderoy Lockhart"}, {"id": 6, "fullName":"Clark Kent"}, {"id": 7, "fullName":"Steve Rogers"}, {"id": 8, "fullName":"Thor Odinson"}, {"id": 9, "fullName":"Carol Denvers"}, {"id": 10, "fullName":"Eric Brooks"}]

    const loadMoreNumbers = () => {
        setLoading(true);
            axios.get(BASE_API, {params: {"pageSize" : size, "pageNumber": page}}).then(res =>{
                setPage(page+1)
                setMovies([...movies, ...res.data.content]);
                setLoading(false);
              })
    };

  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = () => setShowDetails(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit= () => setShowEdit(true);

  const handleCloseError = () => setShowError(false);
  const handleShowError = () => setShowError(true);

  const handleSubmit = () => {
    axios.put(BASE_API, movie).then( res =>{
        setMovies(movies.map(m => {if(m.id != movie.id) return m; return {id: movie.id, date: movie.date, rating:movie.rating, revenue:movie.revenue, title:movie.title}}))
        handleCloseEdit()
    }).catch(function (e){
        seterror(e.response.data)
        console.log(e.response.data)
        handleShowError()
    })
  }

  const handleDelete = (id:string) => {
    axios.delete(BASE_API+"/"+id).then( res =>{
        setMovies(movies.filter(m => m.id != id))
    }).catch(function (e){
        seterror(e.response.data)
        console.log(e.response.data)
        handleShowError()
    })
  }

  const getMovieDetails = (id:string) =>{
    axios.get(BASE_API+"/"+id).then(res => {
        setMovie(res.data);
    })
  }


  return (
    <>
    <Container className='tableFixHead'>
        <InfiniteScroll
            hasMoreData={hasMoreData}
            isLoading={loading}
            onBottomHit={loadMoreNumbers}
            loadOnMount={true}
        >
            <Table>
                <thead>
                <tr>
                    <th>RANK</th>
                    <th>TITLE</th>
                    <th>YEAR</th>
                    <th>RATING</th>
                    <th>REVENUE</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {movies.map((movie, index) =>(
                    <tr key={index}>
                    <td>{index+1}</td>
                    <td>{movie.title}</td>
                    <td>{new Date(movie.date).getFullYear()}</td>
                    <td>{movie.rating}</td>
                    <td>${movie.revenue.toLocaleString('en-US', {maximumFractionDigits:2})}</td>
                    <td><AiFillEye size={25} onClick={() => {handleShowDetails(); getMovieDetails(movie.id)}}/> <AiFillEdit size={25} onClick={() => {handleShowEdit(); getMovieDetails(movie.id)}}/> <AiFillDelete size={25} onClick={() => handleDelete(movie.id)}/></td>
                    </tr>
                )
                )}
                </tbody>
            </Table>
        </InfiniteScroll>
      </Container>

      <Modal show={showDetails} onHide={handleCloseDetails}
        backdrop="static"
        dialogClassName="modal-40w"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{movie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modalGroup'>
                <div className='modalLabel'>Release date</div>                
                <div className='modalText'>{movie?.date}</div>
            </div>
            <div className='modalGroup'>
                <div className='modalLabel'>Genre</div>                
                <div className='modalText'>{movie?.genres.map(({ name }) => name).join(', ')}</div>
            </div>            
            <div className='modalGroup'>
                <div className='modalLabel'>Description</div>                
                <div className='modalText'>{movie?.description}</div>
            </div>                        
            <div className='modalGroup director'>
                <div className='modalLabel'>Director</div>                
                <div className='modalText'>{movie?.director.fullName}</div>
            </div>
            <div className='modalGroup actors'>
                <div className='modalLabel'>Actors</div>                
                <div className='modalText'>{movie?.actors.map(({ fullName }) => fullName).join(', ')}</div>
            </div>
            <div className='modalGroup'>
                <div className='modalLabel'>Runtime</div>                
                <div className='modalText'>{movie?.runtime + " mins"}</div>
            </div>
            <div className='modalGroup'>
                <div className='modalLabel'>Rating</div>                
                <div className='modalText'>{movie?.rating}</div>
            </div>
            <div className='modalGroup'>
                <div className='modalLabel'>Votes</div>                
                <div className='modalText'>{movie?.votes}</div>
            </div>
            <div className='modalGroup'>
                <div className='modalLabel'>Revenue</div>                
                <div className='modalText'>${movie?.revenue.toLocaleString('en-US', {maximumFractionDigits:2})}</div>
            </div>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}
        backdrop="static"
        dialogClassName="modal-40w"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{movie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <FormGroup>
                    <Form.Label className='modalLabel'>Release date</Form.Label>
                    <Form.Control type='text' value={movie?.date} onChange={(e) => setMovie({...movie!, date: e.target.value})}/>
                </FormGroup>
            <div className='modalGroup'>
                <div className='modalLabel'>Genre</div>
                {
                    movie?.genres.map((genre) =>(                        
                        <Button active={true} variant="light" className='customButton' disabled={movie.genres.length==1}>{genre.name}<CloseButton className='customClose' onClick={() =>setMovie({...movie!, genres: movie.genres.filter(movieGenre => movieGenre.id != genre.id)}) }/></Button>
                    ))
                }
                <DropdownButton className='customDropdown' title="Add genre" disabled={movie?.genres.length==3}>
                    {
                        mockGenres.filter(mockGenre => !movie?.genres.map(genre => genre.id).includes(mockGenre.id)).map((genre) =>(
                            <DropdownItem onClick={() => setMovie({...movie, genres: movie!.genres.concat(genre)})}>{genre.name}</DropdownItem>
                        ))
                    }
                </DropdownButton>
            </div>
                <FormGroup>
                    <Form.Label className='modalLabel'>Description</Form.Label>
                    <Form.Control type='text' value={movie?.description} onChange={(e) => setMovie({...movie!, description: e.target.value})} required/>
                </FormGroup>                   
                <div className='modalGroup director'>
                    <div className='modalLabel'>Director</div> 
                    <DropdownButton title={movie.director.fullName}>
                        {
                            mockDirectors.map((mockDirector) => (
                                <DropdownItem onClick={() => setMovie({...movie, director: mockDirector})}>{mockDirector.fullName}</DropdownItem>
                            ))
                        }
                    </DropdownButton>
                </div>
                <div className='modalGroup actors'>
                <div className='modalLabel'>Actors</div>
                {
                    movie?.actors.map((actor) =>(                        
                        <Button active={true} variant="light" className='customButton' disabled={movie.actors.length==1}>{actor.fullName}<CloseButton className='customClose' onClick={() =>setMovie({...movie!, actors: movie.actors.filter(movieActor => movieActor.id != actor.id)}) }/></Button>
                    ))
                }
                <DropdownButton className='customDropdown' title="Add actor" disabled={movie?.actors.length==4}>
                    {
                        mockActors.filter(mockActor => !movie?.actors.map(actor => actor.id).includes(mockActor.id)).map((actor) =>(
                            <DropdownItem onClick={() => setMovie({...movie, actors: movie!.actors.concat(actor)})}>{actor.fullName}</DropdownItem>
                        ))
                    }
                </DropdownButton>
                </div>
                <FormGroup>
                    <Form.Label className='modalLabel'>Runtime</Form.Label>
                    <Form.Control type='number' value={movie?.runtime} onChange={(e) => setMovie({...movie!, runtime: +e.target.value})}/>
                </FormGroup>
                <FormGroup>
                    <Form.Label className='modalLabel'>Rating</Form.Label>
                    <Form.Control type='number' value={movie?.rating} onChange={(e) => setMovie({...movie!, rating: +e.target.value})} min = "1" max="10" required/>
                </FormGroup>
                <FormGroup>
                    <Form.Label className='modalLabel'>Votes</Form.Label>
                    <Form.Control type='number' value={movie?.votes} onChange={(e) => setMovie({...movie!, votes: +e.target.value})}/>
                </FormGroup>
                <FormGroup>
                    <Form.Label className='modalLabel'>Revenue</Form.Label>
                    <Form.Control type='number' value={movie?.revenue} onChange={(e) => setMovie({...movie!, revenue: +e.target.value})}/>
                </FormGroup>
            </Form>
            <Button type='submit' onClick={handleSubmit} className="saveButton">Save</Button>
        </Modal.Body>
      </Modal>

      <Modal show={showError} onHide={handleCloseError}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default MoviesComponent