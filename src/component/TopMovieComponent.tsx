import {useEffect, useState} from 'react';
import axios from "axios";
import {Table, Container, Modal} from 'react-bootstrap';
import { MovieDetailsDto, MovieDto } from '../model';
import { AiFillEye} from 'react-icons/ai';
import { BASE_API } from '../constants';
import {useLocation} from 'react-router-dom';

const TopMovieComponent = () => {
    const [movies, setMovies] = useState<MovieDto[]>([])
    const [showDetails, setShowDetails] = useState(false);
    const [movie, setMovie] = useState<MovieDetailsDto|null>(null)

    const location = useLocation()

    useEffect(() => {
        if(typeof location.state?.year != 'number')
            axios.get(BASE_API + "/top-movies", {params: {"pageSize" : 10, "pageNumber": 0}}).then(res =>{
                setMovies([...res.data.content]);
            })
        else
        axios.get(BASE_API + "/top-movies", {params: {"pageSize" : 10, "pageNumber": 0, "year": location.state.year}}).then(res =>{
            setMovies([...res.data.content]);
        })
    }, [location])
    
    

  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = () => setShowDetails(true);

  const getMovieDetails = (id:string) =>{
    axios.get(BASE_API+"/"+id).then(res => {
        setMovie(res.data);
    })
  }

  return (
    <>
        <Container className='tableFixHead'>
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
                    <td><AiFillEye size={25} onClick={() => {handleShowDetails(); getMovieDetails(movie.id)}}/></td>
                    </tr>
                )
                )}
                </tbody>
            </Table>
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
    </>
  )
}

export default TopMovieComponent