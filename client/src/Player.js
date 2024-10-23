import React, { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null

    return (
        <SpotifyPlayer 
            token={accessToken}
            showSaveIcon
            callback={state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                height: 130,
                sliderHeight: 7,
                bgColor: "#121212",
                color: "#1db954",
                sliderColor: "#1db954",
                trackNameColor: "#b3b3b3"
            }}
        />
    )
}
