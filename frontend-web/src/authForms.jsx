import React, { useState } from "react";


export function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", phone: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registro exitoso, ahora puedes iniciar sesión");
        setSuccess(true);
        if (onSuccess) setTimeout(() => onSuccess(), 1200);
      } else setMessage(data.message || data || "Error en el registro");
    } catch (err) {
      setMessage("Error de red");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Registro</h2>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrarse</button>
      {message && <div className={`text-center text-sm mt-2 ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
    </form>
  );
}


export function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login exitoso");
        setSuccess(true);
        if (onSuccess) setTimeout(() => onSuccess(data.user || { email: form.email }), 1200);
      } else setMessage(data.message || data || "Credenciales inválidas");
    } catch (err) {
      setMessage("Error de red");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4 mt-8">
      <h2 className="text-xl font-bold">Iniciar Sesión</h2>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
      {message && <div className={`text-center text-sm mt-2 ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
    </form>
  );
}