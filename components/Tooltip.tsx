import { Position } from 'geojson'
import { Fragment } from 'react'
import { Popup } from 'react-map-gl'

export interface TooltipProps {
    enabled?: boolean,
    children?: React.ReactNode,
    position: Position,
    maxWidth?: string,
}

export const Tooltip = ({enabled = true, maxWidth = '300px', position, children}: TooltipProps) => {
    return <Fragment>
        {enabled && <Popup
            longitude={position[0]}
            latitude={position[1]}
            offset={[4, -12]}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            maxWidth={maxWidth}
            className="fixed top-0 left-0 transform-none min-w-xs px-3 pt-1 pb-1.5 z-10 bg-gray-700 text-stone-200 rounded drop-shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-ml-2.5 after:border-[6px] after:border-solid after:border-transparent after:border-t-gray-700"
        >
            {children}
        </Popup>}
    </Fragment>
}

export default Tooltip