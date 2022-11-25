
interface PanelProps {
    title?: string,
    children?: React.ReactNode,
}

const Panel = ({ title = '', children }: PanelProps) => {
    return <div className="my-2">
        <legend className="text-lg pt-2 pb-4">{title}</legend>
        {children}
    </div>
}

export default Panel