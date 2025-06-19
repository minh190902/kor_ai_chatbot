
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      {children}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={onClose}>
        Đóng
      </button>
    </div>
  </div>
);

export default Modal;