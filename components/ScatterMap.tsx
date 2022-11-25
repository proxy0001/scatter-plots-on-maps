
import { useState } from 'react'
import { Map, ViewStateChangeEvent, Source, SourceProps, Layer, LayerProps } from 'react-map-gl'
import { FeatureCollection } from 'geojson'

interface MapProps {

}

const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
        {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}, properties: {}}
    ]
}

const sourceProps: SourceProps = {
    id: "my-data",
    type: "geojson",
    data: geojson,
}

const layerProps: LayerProps = {
    id: 'point',
    type: 'circle',
    paint: {
        'circle-radius': 20,
        'circle-color': '#007cbf'
    }
}
const ScatterMap = ({ }: MapProps) => {
    const [viewState, setViewState] = useState({
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
    })
    const onMove:(e: ViewStateChangeEvent) => void = evt => {
        console.log('onMove', evt.viewState)
        setViewState(evt.viewState)
    }
    const onZoom:(e: ViewStateChangeEvent) => void = evt => {
        console.log('onZoom', evt.viewState)
        setViewState(evt.viewState)
    }
    return <div className="w-full h-full">
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            {...viewState}
            onMove={onMove}
            onZoom={onZoom}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            <Source {...sourceProps}>
                <Layer {...layerProps} />
            </Source>
        </Map>
    </div>
}

export default ScatterMap