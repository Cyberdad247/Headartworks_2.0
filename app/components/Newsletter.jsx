"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Newsletter({ className }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
      setName("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
          disabled={status === "loading"}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
          disabled={status === "loading"}
        />
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          disabled={status === "loading"}
          loading={status === "loading"}
        >
          {status === "loading" ? "Signing up..." : "SIGN UP"}
        </Button>
        {message && (
          <p className={`text-sm ${status === "error" ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
        )}
        <p className="text-xs text-white/80">
          You are signing up to receive communication via email and can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
