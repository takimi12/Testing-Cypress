'use client';

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.scss";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  console.log(session)
  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements[0] as HTMLInputElement).value;
    const password = (form.elements[1] as HTMLInputElement).value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      setError("");
      router.replace("/admin");
    }
  };

  return (
    <div className={`Container ${styles.container}`}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Logowanie</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            required
          />
          <button type="submit" className={`button ${styles.submitButton}`}>
            Zaloguj sie
          </button>
          <p className={styles.errorMessage}>{error && error}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;