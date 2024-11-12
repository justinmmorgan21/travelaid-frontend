import "./Modal.css";

export function LoginModal({ children, show, onClose }) {
  if (!show) return null;

  const handleBackgroundClick = (e) => {
    // Check if the clicked element is the background overlay
    if (e.target.className === "modal-background") {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <section className="login-modal-main" onClick={(e) => e.stopPropagation()}>
        {children}
        {/* Close button, if needed */}
        {/* <button className="close" type="button" onClick={onClose}>
          &#x2715;
        </button> */}
      </section>
    </div>
  );
}
