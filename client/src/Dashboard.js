import React, { useState, useEffect } from 'react'
import useAuth from './useAuth'
import TrackSearchResult from './TrackSearchResult'
import ArtistTopTrack from './ArtistTopTrack'
import Player from './Player'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
  clientId: "b454f75404a84bc4b5fd9ad574c67a04"
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [artistTopTracks, setArtistTopTracks] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [currentAlbumArt, setAlbumArt] = useState()
  const [currentArtist, setCurrentArtist] = useState("")
  const [currentTrack, setCurrentTrack] = useState("")
  const [lyrics, setLyrics] = useState("")

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch('')
    setAlbumArt(track.albumUrl)
    setCurrentArtist(track.artist)
    setCurrentTrack(track.title)
  }

  useEffect(() => {
    if (!playingTrack) return setLyrics('')
    
    axios.get('http://localhost:3001/lyrics', {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then(res => {
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

  useEffect(() => {
    if (!playingTrack) return setArtistTopTracks([])
    if (!accessToken) return

    spotifyApi.getArtistTopTracks(playingTrack.artistId, 'US').then(res => {
      setArtistTopTracks(res.body.tracks
        .map(track => {
        return {
          artist: track.artists[0].name,
          artistId: track.artists[0].id,
          title: track.name,
          albumUrl: track.album.images[0].url,
          uri: track.uri
        }
      }))
    })
  }, [playingTrack, accessToken])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false

    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(res.body.tracks.items.map(track => {
        return {
          artist: track.artists[0].name,
          artistId: track.artists[0].id,
          title: track.name,
          uri: track.uri,
          albumUrl: track.album.images[0].url
        }
      }))
    })
    return () => cancel = true
  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' style={{ height: "100vh", backgroundColor: "#121212" }}>
      <h1 className='text-center my-2' style={{ color: '#1db954' }}>Spotify Web Player</h1>
      <Form.Control 
        type='search' 
        placeholder='Search Songs / Artists' 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        className='my-2'
      />
      <div className="flex-grow-1 my-2 border-bottom border-white" style={{
        maxHeight: '1000px',
        overflowY: 'auto'
      }}>
        {searchResults.map(track => (
          <TrackSearchResult 
            track={track} 
            key={track.uri} 
            chooseTrack={chooseTrack}
          />
        ))}

        {searchResults.length === 0 && (
          <Container className='d-flex justify-content-center align-items-center flex-column' style={{ color: "#fff" }}>
            {!playingTrack && (<Container>
              <div className='my-4' style={{ 
                fontSize: "24px", 
                color: "#1db954", 
                textAlign: "center",
                fontStyle: "italic" }}>Search for music above and get smoovin'</div>
            </Container>)}
            
            {playingTrack && (<Container className='d-flex flex-row mt-3 pb-4 border-bottom border-white'>
              <img src={currentAlbumArt} alt='' className='border-none' 
                style={{ 
                  objectFit: "contain",
                  maxHeight: "120px"
                }}>
              </img>
              <Container className='d-flex justify-content-center align-items start flex-column'>
                <div style={{ fontSize: "28px", color: "#1db954" }}>Now Playing</div>
                <div style={{ fontSize: "32px" }}>{currentArtist}</div>
                <div style={{ fontSize: "20px", fontStyle: "italic" }}>{currentTrack}</div>
              </Container>
            </Container>)}
            <Container className='d-flex flex-row align-items-start justify-content-between mt-3'>
              <Container className='d-flex flex-column' style={{ width: "100%", maxWidth: "45vh" }}>
                {playingTrack && (<div className='px-3' style={{ fontSize: "24px" }}>Artist Top Tracks</div>)}
                <div>
                  {artistTopTracks.map(track => (
                    <ArtistTopTrack 
                      track={track}
                      key={track.uri}
                      chooseTrack={chooseTrack}
                    />
                  ))}
                </div>
              </Container>

              <Container className='d-flex flex-column align-items-center justify-content-start'>
                {playingTrack && (<div style={{ fontSize: "24px" }}>Lyrics</div>)}
                <div 
                  className='text-center' 
                  style={{ 
                    whiteSpace:"pre",
                    marginTop: "15px", 
                    fontSize: "16px",
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    maxHeight: "750px",
                    padding: "0 12px",
                    width: "100%"
                  }}
                >
                  {lyrics}
                </div>
              </Container>
            </Container>
          </Container>
        )}
      </div>
      <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} /></div>
    </Container>
  )
}
