import { useTranslation } from 'react-i18next';

const Modal = ({ children, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={onClose}>
          {t("common.close")}
        </button>
      </div>
    </div>
  );
};

export default Modal;