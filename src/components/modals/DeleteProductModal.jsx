import { Modal } from "antd";

export default function DeleteProductModal({
  isVisible,
  onCancel,
  onOk,
  productName,
}) {
  return (
    <Modal
      title="Delete Product"
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <p>
        Are you sure you want to delete{" "}
        {productName ? `"${productName}"` : "this product"}? This action cannot
        be undone.
      </p>
    </Modal>
  );
}
