import React from 'react'
import './App.css'

import { Container } from 'react-bootstrap'

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=b454f75404a84bc4b5fd9ad574c67a04&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
  return (
    <Container 
      className='d-flex flex-column justify-content-center align-items-center' 
      style = {{ 
        minHeight: "100vh",
        backgroundColor: "#121212"
      }}
    >
      <div className='m-4'>
        <h1 className='text-center my-2' style={{ color: '#1db954' }}>Spotify Web Player</h1>
      </div>
      <div className='m-4'>
        <a className='btn btn-success btn-lg login' href={AUTH_URL}>Login With Spotify</a>
      </div>

  </Container>
  )
}
