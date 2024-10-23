import React from 'react'

export default function TrackSearchResult({ track, chooseTrack }) {
    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div 
            className='d-flex m-2 px-3 py-2 align-items-center' 
            style={{ 
                cursor: 'pointer',
                backgroundColor: '#535353',
                border: '2px solid #1db954',
                borderRadius: '16px'
            }}
            onClick={ handlePlay }
        >
            <img src={track.albumUrl} style={{ 
                height: "64px", 
                width: "64px", 
                borderRadius: "4px" 
            }} alt='Album Art'/>
            <div className='mx-3'>
                <div style={{ color: "#fff "}}>{track.title}</div>
                <div style={{ color: "#b3b3b3 "}}>{track.artist}</div>
            </div>
        </div>
  )
}
