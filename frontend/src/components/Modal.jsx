export default function Modal({titulo, onFechar, children}){
    return (
        <div className="fundo-modal" onClick={onFechar}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{titulo}</h3>
                {children}
            </div>
        </div>
    );
}