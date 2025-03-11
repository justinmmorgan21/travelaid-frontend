import "./Modal.css";

export function ImagePickerModal({ children, show, onClose }) {
  if (!show) return null;

  const handleBackgroundClick = (e) => {
    // Check if the clicked element is the background overlay
    if (e.target.className === "modal-background") {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <section className="image-picker-modal-main" onClick={(e) => e.stopPropagation()}>
        {children}
      </section>
    </div>
  );
}
