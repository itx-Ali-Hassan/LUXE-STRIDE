import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message, Popconfirm } from "antd";
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/productService.js";
import Loader from "../../components/Loader.jsx";
import "./Products.scss";

const CATEGORIES = ["Sneakers", "Running", "Formal", "Boots", "Sandals", "Sports"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    getProducts({ limit: 100 })
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
    });
    setFileList([]);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted");
      loadProducts();
    } catch (err) {
      message.error(err.response?.data?.message || "Could not delete product");
    }
  };

  const handleSubmit = async (values) => {
    if (!editing && fileList.length === 0) {
      message.error("Please upload a product image");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, val]) => fd.append(key, val));
      if (fileList[0]?.originFileObj) fd.append("image", fileList[0].originFileObj);

      if (editing) {
        await updateProduct(editing._id, fd);
        message.success("Product updated");
      } else {
        await createProduct(fd);
        message.success("Product added");
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      message.error(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading products" />;

  return (
    <div className="admin-products">
      <div className="admin-products__head">
        <h1 className="font-display">Products</h1>
        <button className="btn-luxe-solid" onClick={openCreate}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="admin-table-wrap glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.image.url} alt={p.name} className="admin-thumb" /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="admin-table__actions">
                  <button onClick={() => openEdit(p)}><FiEdit2 /></button>
                  <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(p._id)}>
                    <button className="danger"><FiTrash2 /></button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="admin-panel__empty">No products yet — add your first one.</p>}
      </div>

      <Modal
        title={editing ? "Edit Product" : "Add Product"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="form-luxe">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Obsidian Runner" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
          </Form.Item>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Form.Item name="price" label="Price ($)" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item name="brand" label="Brand" initialValue="LuxeStride">
            <Input />
          </Form.Item>
          <Form.Item label="Product Image">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<FiUpload />}>Upload Image</Button>
            </Upload>
            {editing && <p className="admin-hint">Leave empty to keep the current image.</p>}
          </Form.Item>
          <Button htmlType="submit" type="primary" loading={saving} block>
            {editing ? "Save Changes" : "Add Product"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
