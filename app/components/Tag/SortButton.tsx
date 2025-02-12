interface SortButtonProps {
    label: string
    onClick: () => void
    isActive: boolean
}

export function SortButton({ label, onClick, isActive }: SortButtonProps) {
    const className = isActive ? "opacity-100" : "opacity-50 hover:opacity-100"

    return <div className={`flex items-center bg-gray rounded-md transition-all duration-300 ${className}`}>
        <button className="px-4 py-2" onClick={onClick}>{label}</button>
    </div>
}