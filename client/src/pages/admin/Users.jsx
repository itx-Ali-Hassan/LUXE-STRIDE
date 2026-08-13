import React, { useEffect, useState } from "react";
import { Select, Popconfirm, message, Tag } from "antd";
import { getUsers, updateUserRole, deleteUser } from "../../api/userService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/Loader.jsx";
import "./Products.scss";
import "./Users.scss";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadUsers = () => {
    setLoading(true);
    getUsers()
      .then((data) => setUsers(data.users))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      message.success("Role updated");
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      message.error(err.response?.data?.message || "Could not update role");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      message.success("User removed");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      message.error(err.response?.data?.message || "Could not delete user");
    }
  };

  if (loading) return <Loader label="Loading users" />;

  return (
    <div className="admin-users">
      <h1 className="font-display">Users</h1>
      <p className="admin-users__count">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>

      <div className="admin-table-wrap glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u._id === currentUser._id ? (
                    <Tag color="gold">{u.role} (you)</Tag>
                  ) : (
                    <Select
                      value={u.role}
                      size="small"
                      style={{ width: 110 }}
                      options={[
                        { value: "customer", label: "Customer" },
                        { value: "admin", label: "Admin" },
                      ]}
                      onChange={(v) => handleRoleChange(u._id, v)}
                    />
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u._id !== currentUser._id && (
                    <Popconfirm title="Remove this user?" onConfirm={() => handleDelete(u._id)}>
                      <button className="admin-users__delete">Delete</button>
                    </Popconfirm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
