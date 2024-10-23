import React from 'react'

export default function ArtistTopTrack({ track, chooseTrack }) {
    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div 
            className='d-flex m-2 px-3 py-2 align-items-center' 
            style={{ 
                cursor: 'pointer',
                backgroundColor: '#212121',
                borderBottom: '2px solid #1db954',
                borderRadius: '16px',
                paddingLeft: '10px'
            }}
            onClick={ handlePlay }
        >
            <img src={track.albumUrl} style={{ 
                height: "48px", 
                width: "48px", 
                borderRadius: "6px" 
            }} alt='Album Art'/>
            <div className='mx-3'>
                <div style={{ color: "#fff", fontSize: "16px" }}>{track.title}</div>
                <div style={{ color: "#b3b3b3", fontSize: "12px" }}>{track.artist}</div>
            </div>
        </div>
    )
}
