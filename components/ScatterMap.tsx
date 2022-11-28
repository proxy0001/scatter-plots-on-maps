
import { useState, useRef, useEffect, useCallback, Fragment } from 'react'
import { Map, ViewStateChangeEvent, MapLayerMouseEvent, Source, SourceProps, Layer, LayerProps, MapRef, LngLatBoundsLike, LngLatLike, ViewState, Popup, PopupProps, PopupEvent } from 'react-map-gl'
import { FeatureCollection, Feature, Position, GeoJsonProperties, Point } from 'geojson'
import sampleData from '../sampleData.json' assert {type: 'json'}
import { palette, Codes } from '../utils/palette'
import Tooltip from './Tooltip'

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const circleColor: mapboxgl.Expression = (() => {
    const colours: Codes = palette.all(400)
    const countryOrder = ['Taiwan', 'China', 'Hong Kong', 'Japen', 'Korean', 'Others']
    const countryColors = countryOrder.reduce((acc: string[], cur: string, idx: number): string[] => {
        acc.push(cur, colours.jumpget(idx, countryOrder.length))
        return acc
    }, [])
    return [
        'match',
        ['get', 'homeCountry'],
        ...countryColors,
        // default color
        colours.jumpget(countryOrder.length, countryOrder.length)
    ]
})()

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
    generateId: true,
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
        'circle-color': circleColor,
    }
}

const defaultViewState: ViewState = {
    longitude: 0,
    latitude: 0,
    zoom: 0,
    bearing: 0,
    pitch: 0,
    padding: {left: 0, right: 0, top: 0, bottom: 0}
}

const initialViewState = {
    bounds: mockDataBounds,
    fitBoundsOptions: {
        padding: {left: 100, right: 100, top: 100, bottom: 100}
    }
}

type TooltipInfo = {
    city?: string,
    homeCountry?: string,
    imei?: string,
    unixTimestamp?: string,
}

type RGBA = {r: number, g: number, b: number, a: number}

type HoverInfo = {
    lon: number,
    lat: number,
    properties: TooltipInfo,
    featureId: Feature['id'],
    circleColor: RGBA | undefined
}

const rgba2hex = (rgba: RGBA): string => {
    const r = Math.round(Math.round(rgba.r * 100) / 100 * 255)
    const g = Math.round(Math.round(rgba.g * 100) / 100 * 255)
    const b = Math.round(Math.round(rgba.b * 100) / 100 * 255)
    const a = Math.round(Math.round(rgba.a * 100) / 100 * 255)
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) + (a + 0x10000).toString(16).slice(-2).toUpperCase()
}

const timestampFormatter = (timestamp: string | number) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000
    return new Date(timestamp as number * 1000 - tzoffset).toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ').replace(/:\d{2}$/, '');
}

const defaultHoverInfo: HoverInfo = {
    lon: 0,
    lat: 0,
    properties: {},
    featureId: undefined,
    circleColor: undefined,
}


const ScatterMap = ({}: MapProps) => {
    const mapRef = useRef<MapRef>(null)
    const [viewState, setViewState] = useState<ViewState>(defaultViewState)
    const [showTooltip, setShowTooltip] = useState(false)
    const [hoverInfo, setHoverInfo] = useState<HoverInfo>(defaultHoverInfo)
    const {city, homeCountry, imei, unixTimestamp}: TooltipInfo = hoverInfo.properties

    const toggleTooltip = (state: boolean, hoverInfo: HoverInfo = defaultHoverInfo): void => {
        if (state === undefined) state = !showTooltip
        if (!state) setHoverInfo(defaultHoverInfo)
        else setHoverInfo(hoverInfo)
        setShowTooltip(state)
    }

    const onMouseMove: (evt: MapLayerMouseEvent) => void = evt => {
        const newFeature: Feature | undefined = evt.features && evt.features[0]
        if (newFeature === undefined) return toggleTooltip(false)
        if (newFeature.id === hoverInfo.featureId) return
        const featureId: Feature['id'] = newFeature.id
        const properties: HoverInfo['properties'] = newFeature.properties || {}
        const [lon, lat]: Position = (newFeature.geometry as Point).coordinates
        const geoJsonProperties = newFeature as GeoJsonProperties
        const circleColor = geoJsonProperties && geoJsonProperties.layer.paint['circle-color']
        toggleTooltip(true, { lon, lat, properties, featureId, circleColor })
    }

    return <div className="w-full h-full relative">
        <Map
            ref={mapRef}
            initialViewState={initialViewState}
            mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            // {...viewState}
            onMouseMove={onMouseMove}
            interactiveLayerIds={['point']}
            mapStyle="mapbox://styles/mapbox/light-v11"
        >
            <Source {...sourceProps}>
                <Layer {...layerProps} />
            </Source>
            <Tooltip enabled={showTooltip} position={[hoverInfo.lon, hoverInfo.lat]}>
                <div className="text-base my-1.5 flex items-center">
                    {homeCountry && (
                        <Fragment>
                            <div className={`rounded-full w-4 h-4 bg-gray-700 border-2 border-stone-200 mr-1.5`}
                                style={hoverInfo.circleColor ? {backgroundColor: rgba2hex(hoverInfo.circleColor)} : {}}></div>
                            <div>{homeCountry}</div>
                        </Fragment>
                    )}
                </div>
                <div className="text-[13px] my-1 break-all">{imei}</div>
                <div className="text-[13px] my-1">{unixTimestamp && timestampFormatter(unixTimestamp)}</div>
            </Tooltip>
        </Map>
    </div>
}

export default ScatterMap