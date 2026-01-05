interface Props {
    onClick: () => void;
    unreadCount?: number;
}

export default function MessageIcon({ onClick, unreadCount = 0 }: Props) {
    return (
        <div style={{ position: "relative", cursor: "pointer" }} onClick={onClick}>
            💬
            {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
            )}
        </div>
    );
}
