export default function Modal({titulo, onFechar, largo, children}){
    return (
        <div className="fundo-modal" onClick={onFechar}>
            <div className={"modal" + (largo ? 'modal-largo': '')} onClick={(e) => e.stopPropagation()}>
                <h3>{titulo}</h3>
                {children}
            </div>
        </div>
    );
}