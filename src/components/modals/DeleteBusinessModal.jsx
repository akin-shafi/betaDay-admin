import { Modal } from "antd";

export default function DeleteBusinessModal({
  isVisible,
  onCancel,
  onOk,
  businessName,
}) {
  return (
    <Modal
      title="Delete Business"
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <p>
        Are you sure you want to delete{" "}
        {businessName ? `"${businessName}"` : "this business"}? This action
        cannot be undone.
      </p>
    </Modal>
  );
}
