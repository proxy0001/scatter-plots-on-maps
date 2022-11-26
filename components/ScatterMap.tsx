
import { useState, useRef, useEffect, useCallback } from 'react'
import { default as mapboxgl, Map, ViewStateChangeEvent, Source, SourceProps, Layer, LayerProps, MapRef, LngLatBoundsLike, ViewState } from 'react-map-gl'
import { FeatureCollection, Feature, Position } from 'geojson'
import sampleData from '../sampleData.json' assert {type: 'json'}
import defaultColors from 'tailwindcss/colors'

const colors: string[] = Object.keys(defaultColors)
    .filter((k: string) => typeof defaultColors[k as keyof typeof defaultColors] === 'object')
    .reduce((acc: string[], cur:string): string[] => {
        acc.push(defaultColors[cur as keyof typeof defaultColors][400])
        return acc
    }, [])
    .sort((a, b) => a > b ? -1 : 1)

const countryOrder: any[] = ['Taiwan', 'China', 'Hong Kong', 'Japen', 'Korean', 'Others']
const countryColors: mapboxgl.Expression = countryOrder.reduce((acc: string[], cur: string, idx: number, ary: string[]): string[] => {
    acc.push(cur, colors[idx * countryOrder.length % colors.length])
    if (idx === countryOrder.length - 1) acc.push(colors[(idx + 1) * countryOrder.length % colors.length])
    return acc
}, [])
const circleColor: mapboxgl.Expression = [
    'match',
    ['get', 'homeCountry'],
    ...countryColors,
]

console.log(circleColor)
interface MapProps {

}
const mockData = sampleData

const mockFeatures = mockData.map((d): Feature => ({
    type: 'Feature',
    geometry: {type: 'Point', coordinates: [d.lon, d.lat]},
    properties: {
        imei: d.imei,
        homeCountry: d.homeCountry,
        unixTimestamp: d.unixTimestamp,
        city: d.city,
    }
}))

const mockDataBounds: LngLatBoundsLike = mockData.reduce((acc, cur) => {
    if (cur.lon < acc[0][0]) acc[0][0] = cur.lon
    if (cur.lon > acc[1][0]) acc[1][0] = cur.lon
    if (cur.lat < acc[0][1]) acc[0][1] = cur.lat
    if (cur.lat > acc[1][1]) acc[1][1] = cur.lat
    return acc
}, [[180, 90], [-180, -90]])

const mockDataCenter:Position = mockData.reduce((acc:Position, cur):Position => [
    acc[0] !== undefined ? (acc[0] + cur.lon) / acc.length : cur.lon,
    acc[1] !== undefined ? (acc[1] + cur.lat) / acc.length : cur.lat,
], [])

const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: mockFeatures,
}

const sourceProps: SourceProps = {
    id: "imei",
    type: "geojson",
    data: geojson,
}

const layerProps: LayerProps = {
    id: 'point',
    type: 'circle',
    source: 'imei',
    paint: {
        // Make circles larger as the user zooms from z12 to z22.
        'circle-radius': {
            'base': 2,
            'stops': [
                [12, 4],
                [22, 180]
            ]
        },
        'circle-color': circleColor
    }
}

const initialViewState = {
    bounds: mockDataBounds,
    fitBoundsOptions: {
        padding: {left: 100, right: 100, top: 100, bottom: 100}
    }
}

const ScatterMap = ({ }: MapProps) => {
    const mapRef = useRef<MapRef>(null)
    const [viewState, setViewState] = useState<ViewState>({
        longitude: 0,
        latitude: 0,
        zoom: 0,
        bearing: 0,
        pitch: 0,
        padding: {left: 0, right: 0, top: 0, bottom: 0}
    })
    const onMapLoad = useCallback(() => {
        // mapRef.current?.fitBounds()
        console.log('useCallback', mapRef.current)
        // mapRef && mapRef.current && mapRef.current.on('move', () => {
        //   // do something
        // })
    }, []);
    useEffect(() => {
        // console.log(mapRef.current)
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
            ref={mapRef}
            initialViewState={initialViewState}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            // {...viewState}
            onLoad={onMapLoad}
            onMove={onMove}
            onZoom={onZoom}
            mapStyle="mapbox://styles/mapbox/light-v11"
        >
            <Source {...sourceProps}>
                <Layer {...layerProps} />
            </Source>
        </Map>
    </div>
}

export default ScatterMap