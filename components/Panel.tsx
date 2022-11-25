
interface PanelProps {
    title?: string,
    children?: React.ReactNode,
}

const Panel = ({ title = '', children }: PanelProps) => {
    return <div className="py-2">
        <legend className="text-lg py-3">{title}</legend>
        {children}
    </div>
}

export default Panel