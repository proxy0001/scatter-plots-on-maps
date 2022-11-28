
import { useState, Fragment } from 'react'
import { Map, MapLayerMouseEvent, Source, SourceProps, Layer, LayerProps, LngLatBoundsLike, ViewState, InitialViewState } from 'react-map-gl'
import { Feature, Position, GeoJsonProperties, Point } from 'geojson'
import { palette, Codes } from '../utils/palette'
import Tooltip from './Tooltip'
import { RGBA } from '../utils/helper'

export interface ScatterMapProps {
    data: any[]
    filter?: mapboxgl.Expression
    categoryItems?: string[]
    categoryName?: string
    getLongitude?: (d: object) => number
    getLatitude?: (d: object) => number
    propertiesHandler?: (d: object) => object
    children?: React.ReactNode
    onMouseIn?: (hoverInfo: HoverInfo) => void
    onMouseOut?: () => void
}

export type HoverInfo = {
    lon: number,
    lat: number,
    properties: object,
    featureId: Feature['id'],
    circleColor: RGBA | undefined
}

export const defaultHoverInfo: HoverInfo = {
    lon: 0,
    lat: 0,
    properties: {},
    featureId: undefined,
    circleColor: undefined,
}

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const sourceId = 'data1'

const computeFeatures = ({data, propertiesHandler}: ScatterMapProps) => data.map((d): Feature => {
    return {
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [d.lon, d.lat]},
        properties: propertiesHandler ? propertiesHandler(d) : {}
    }
})

const computeBounds = ({data, getLongitude, getLatitude}: ScatterMapProps): LngLatBoundsLike | undefined => {
    if (!getLongitude || !getLatitude) return undefined
    return data.reduce((acc, cur) => {
        const [lon, lat] = [getLongitude(cur), getLatitude(cur)]
        if (lon < acc[0][0]) acc[0][0] = lon
        if (lon > acc[1][0]) acc[1][0] = lon
        if (lat < acc[0][1]) acc[0][1] = lat
        if (lat > acc[1][1]) acc[1][1] = lat
        return acc
    }, [[180, 90], [-180, -90]]) as LngLatBoundsLike
}

const computeCircleColor = (categoryName: string, categoryItems: string[]): mapboxgl.Expression => {
    const colours: Codes = palette.all(400)
    const span = Math.floor(colours.data.length / categoryItems.length)
    const countryColors = categoryItems.reduce((acc: string[], cur: string, idx: number): string[] => {
        acc.push(cur, colours.jumpget(idx, span, 2))
        return acc
    }, [])
    return [
        'match',
        ['get', categoryName],
        ...countryColors,
        colours.jumpget(categoryItems.length, span, 2) // default color
    ]
}

const genInitialViewState = (scatterMapProps: ScatterMapProps): InitialViewState => {
    return {
        bounds: computeBounds(scatterMapProps),
        fitBoundsOptions: {
            padding: {left: 100, right: 100, top: 100, bottom: 100}
        }
    }
}

const genSourceProps = (scatterMapProps: ScatterMapProps): SourceProps => {
    return {
        id: sourceId,
        type: "geojson",
        data: {
            type: 'FeatureCollection',
            features: computeFeatures(scatterMapProps),
        },
        generateId: true,
    }
}

const genLayerProps = ({categoryName, categoryItems, filter}: ScatterMapProps): LayerProps => {
    const props = {
        id: 'point',
        type: 'circle',
        source: sourceId,
        paint: {
            'circle-radius': {
                'base': 2,
                'stops': [
                    [12, 4],
                    [22, 100]
                ]
            },
            'circle-color': computeCircleColor(categoryName as string, categoryItems as string[]),
        },
        filter: filter
    }
    return props as LayerProps
}

export const ScatterMap = ({
    data,
    filter,
    categoryName,
    categoryItems,
    getLongitude = (d: object) => d['lon' as keyof typeof d],
    getLatitude = (d: object) => d['lat' as keyof typeof d],
    propertiesHandler = (d: object) => ({}),
    onMouseIn,
    onMouseOut,
    children,
}: ScatterMapProps) => {
    const props = {data, filter, categoryName, categoryItems, getLongitude, getLatitude, propertiesHandler}
    const sourceProps = genSourceProps(props)
    const layerProps = genLayerProps(props)
    const initialViewState = genInitialViewState(props)

    const [showTooltip, setShowTooltip] = useState(false)
    const [lastId, setLastId] = useState<number | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState<Position>([0, 0])

    const toggleTooltip = (state: boolean, hoverInfo: HoverInfo = defaultHoverInfo): void => {
        if (state === undefined) state = !showTooltip
        if (!state && onMouseOut) onMouseOut()
        else if (onMouseIn) onMouseIn(hoverInfo)
        setShowTooltip(state)
    }

    const onMouseMove: (evt: MapLayerMouseEvent) => void = evt => {
        const newFeature: Feature | undefined = evt.features && evt.features[0]
        if (newFeature === undefined) return toggleTooltip(false)
        if (newFeature.id === lastId) return
        const featureId: Feature['id'] = newFeature.id
        const properties: HoverInfo['properties'] = newFeature.properties || {}
        const [lon, lat]: Position = (newFeature.geometry as Point).coordinates
        const geoJsonProperties = newFeature as GeoJsonProperties
        const circleColor = geoJsonProperties && geoJsonProperties.layer.paint['circle-color']
        setTooltipPosition([lon, lat])
        setLastId(newFeature.id as number)
        toggleTooltip(true, { lon, lat, properties, featureId, circleColor })
    }

    return <div className="w-full h-full relative">
        <Map
            initialViewState={initialViewState}
            mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            onMouseMove={onMouseMove}
            interactiveLayerIds={['point']}
            mapStyle="mapbox://styles/mapbox/light-v11"
        >
            <Source {...sourceProps}>
                <Layer {...layerProps} />
            </Source>
            <Tooltip enabled={showTooltip} position={[tooltipPosition[0], tooltipPosition[1]]}>
                {children}
            </Tooltip>
        </Map>
    </div>
}

export default ScatterMap