"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

const initialForm = { name: "", email: "", phone: "", message: "", website: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus("Sending…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to send your message.");
      setForm(initialForm);
      setStatus("Message sent. Thank you!");
    } catch (error) {
      setStatus(`${error.message || "Please try again."}`);
    } finally {
      setSubmitting(false);
    }
  }

  return <form className={styles.form} onSubmit={submit}>
    <div className={styles.pair}>
      <label><span>Name <i>*</i></span><input required minLength="2" maxLength="80" name="name" value={form.name} onChange={change} autoComplete="name" aria-label="Name" /></label>
      <label><span>Email <i>*</i></span><input required maxLength="254" type="email" name="email" value={form.email} onChange={change} autoComplete="email" aria-label="Email" /></label>
    </div>
    <label className={styles.phone}><span>Phone <small>(optional)</small></span><input maxLength="30" type="tel" name="phone" value={form.phone} onChange={change} autoComplete="tel" aria-label="Phone, optional" /></label>
    <label className={styles.message}><span>Message <i>*</i></span><textarea required minLength="10" maxLength="5000" name="message" value={form.message} onChange={change} rows="7" aria-label="Message" /></label>
    <label className={styles.honeypot} aria-hidden="true">Website<input name="website" value={form.website} onChange={change} tabIndex="-1" autoComplete="off" /></label>
    <div className={styles.action}>
      <button type="submit" disabled={submitting}><span>{submitting ? "Sending" : "Submit"}</span><span aria-hidden="true">↗</span></button>
      <output aria-live="polite">{status}</output>
    </div>
  </form>;
}
