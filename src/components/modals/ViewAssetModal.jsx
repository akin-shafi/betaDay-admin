/* eslint-disable react/prop-types */
import { Modal } from "antd";

const ViewAssetModal = ({ visible, selectedAsset, onClose }) => {
  return (
    <Modal open={visible} footer={null} onCancel={onClose} centered>
      <div className="text-center">
        <img
          src={selectedAsset?.image}
          alt="Selected Asset"
          className="w-full max-w-[500px] h-auto mt-6 object-contain rounded-md mb-4"
        />
        <p className="text-lg font-semibold">{selectedAsset?.caption}</p>
        <p className="text-gray-600">{selectedAsset?.description}</p>
      </div>
    </Modal>
  );
};

export default ViewAssetModal;
