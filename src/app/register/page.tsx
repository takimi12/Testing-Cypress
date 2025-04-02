'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";


interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const router = useRouter();

  const validate = () => {
  const newErrors: Partial<FormState> = {};

    if (!form.name.trim()) newErrors.name = "Imię i nazwisko jest wymagane";

    if (!form.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Niepoprawny format emaila";
    }

    if (!form.password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (form.password.length < 8) {
      newErrors.password = "Hasło musi mieć co najmniej 8 znaków";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Hasło musi zawierać co najmniej jedną dużą literę";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Hasło musi zawierać co najmniej jedną cyfrę";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Musisz potwierdzić hasło";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Hasła muszą się zgadzać";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Usuwanie błędu po poprawnym wpisaniu
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
     router.push('/dashboard')
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label>Imię i nazwisko</label>
        <input id="name" type="text" name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label>Email</label>
        <input id="email" type="email" name="email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label>Hasło</label>
        <input id="password" type="password" name="password" value={form.password} onChange={handleChange} className="border p-2 w-full" />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>
      <div>
        <label>Potwierdź hasło</label>
        <input id="confirmPassword" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="border p-2 w-full" />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
      </div>
      <button id="register" type="submit" className="bg-blue-500 text-white p-2 w-full">Zarejestruj się</button>
    </form>
  );
}
