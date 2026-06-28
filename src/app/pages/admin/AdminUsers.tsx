import React, { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "../../components/AdminLayout";
import { GlassCard } from "../../components/GlassCard";
import { RoundedButton } from "../../components/RoundedButton";
import { Search, UserPlus, Mail, Edit, Trash2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "cashier";
  created_at: string;
}

const API = "https://cartsense.site/cart-sense-api/";
export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin" | "cashier",
  });

  // ========================
  // FETCH USERS
  // ========================
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/get_users.php`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Backend not reachable");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================
  // OPEN MODAL
  // ========================
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // ========================
  // CREATE / UPDATE
  // ========================
  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editingUser) {
        await axios.post(`${API}/update_user.php`, {
          id: editingUser.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });

        toast.success("User updated");
      } else {
        await axios.post(`${API}/create_user.php`, formData);
        toast.success("User added");
      }

      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      toast.error("Server error");
    }
  };

  // ========================
  // DELETE
  // ========================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.post(`${API}/delete_user.php`, { id });
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ========================
  // UPDATE ROLE
  // ========================
  const handleUpdateRole = async (
    user: User,
    newRole: "user" | "admin" | "cashier",
  ) => {
    try {
      await axios.post(`${API}/update_user.php`, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: newRole,
      });

      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error("Role update failed");
    }
  };

  // ========================
  // FILTER
  // ========================
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-[#fdf5e6] text-xl font-semibold">Users</h1>
          <p className="text-[#fdf5e6]/70 text-sm">Manage system accounts</p>
        </div>

        <RoundedButton onClick={() => handleOpenDialog()}>
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </RoundedButton>
      </div>

      {/* SEARCH */}
      <GlassCard className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#fdf5e6]/60" />
          <Input
            className="pl-10"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard>
        <table className="w-full text-[#fdf5e6]">
          <thead className="text-left border-b border-[#fdf5e6]/10">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#fdf5e6]/5">
                <td className="py-3">{user.name}</td>

                <td className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#fdf5e6]/60" />
                  {user.email}
                </td>

                {/* ROLE BADGE */}
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : user.role === "cashier"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                      }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>{user.created_at}</td>

                {/* ACTIONS */}
                <td className="flex items-center gap-2 py-2">
                  {/* EDIT */}
                  <button
                    onClick={() => handleOpenDialog(user)}
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md flex items-center gap-1 text-white transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 text-white transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>

                  {/* ROLE CHANGE */}
                  <Select
                    value={user.role}
                    onValueChange={(value: any) =>
                      handleUpdateRole(user, value)
                    }
                  >
                    <SelectTrigger className="w-[120px] border border-[#fdf5e6]/20">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="user">👤 User</SelectItem>
                      <SelectItem value="admin">🛡 Admin</SelectItem>
                      <SelectItem value="cashier">💳 Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            {!editingUser && (
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            )}

            <Select
              value={formData.role}
              onValueChange={(value: any) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>

            <RoundedButton onClick={handleSubmit}>
              {editingUser ? "Update" : "Create"}
            </RoundedButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
