import { Position } from 'geojson'
import { Fragment } from 'react'
import { Popup } from 'react-map-gl'

export interface TooltipProps {
    enabled?: boolean,
    children?: React.ReactNode,
    position: Position,
}

export const Tooltip = ({enabled = true, position, children}: TooltipProps) => {
    return <Fragment>
        {enabled && <Popup
            longitude={position[0]}
            latitude={position[1]}
            offset={[4, -12]}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            className="fixed top-0 left-0 transform-none bg-stone-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-ml-2.5 after:border-[6px] after:border-solid after:border-transparent after:border-t-stone-400"
        >
            {children}
        </Popup>}
    </Fragment>
}

export default Tooltip