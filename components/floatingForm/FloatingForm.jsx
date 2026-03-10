"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BsEnvelopePlus } from "react-icons/bs";
import { toast } from "react-toastify";
import { toastStyle } from "@/components/toastNotification";

export default function FloatingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e) => {
    setFormData(data => ({ ...data, [e.target.id]: e.target.value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required.", toastStyle)
      return false
    }

    if (!formData.email.trim()) {
      toast.error("Email is required", toastStyle);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address", toastStyle);
      return false;
    }

    if (!formData.message.trim()) {
      toast.error("Message is required", toastStyle);
      return false;
    }

    return true;

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        fname: formData.name,
        email: formData.email,
        number: "",
        message: formData.message,
        page_url: window.location.href,
      };

      const response = await fetch(
        "https://8kb7ux2337.execute-api.ap-south-1.amazonaws.com/createlead",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // handle http error
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        const msg = err?.message || err?.error || "Something went wrong.";
        toast.error(msg, toastStyle);
        return;
      }

      // parse json
      const result = await response.json().catch(() => ({}));

      // backend error in json
      if (result.error || result.message === "error") {
        toast.error(result.error || result.message, toastStyle);
        return;
      }

      // Fire Google conversion pixel
      var img = document.createElement("img");
      img.src =
        "https://www.googleadservices.com/pagead/conversion/643192894/?value=1.0&currency_code=INR&label=B3WkCKTb0_IaEL6w2bIC&guid=ON&script=0";
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      document.body.appendChild(img);

      toast("Form submission succeeded", toastStyle);

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error.message || "Form submission failed. Please try again.",
        toastStyle
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-[var(--mainColor)] text-white p-3 md:p-4 rounded-full shadow-lg transition cursor-pointer outline-none
          ${isOpen ? "opacity-50 pointer-events-none" : "hover:opacity-70"}
        `}
        aria-label="Open form"
      >
        <BsEnvelopePlus className="w-3 h-3 md:w-5 md:h-5" />
      </button>


      {/* Form */}
      <div
        className={`absolute right-full mr-2 md:mr-4 top-1/2 -translate-y-1/2
    transition-all duration-300 origin-right w-[280px] md:w-[350px]
        ${isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0 pointer-events-none"
          }
      `}
      >
        <div className="relative bg-white rounded-lg p-6 border border-gray-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,1)]">
          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-14 right-0 bg-[var(--mainColor)] text-white p-3 md:p-4 rounded-full shadow-lg hover:opacity-70 transition cursor-pointer outline-none"
            aria-label="Close form"
          >
            <FaTimes className="w-3 h-3 md:w-5 md:h-5" />
          </button>

          <h3 className="text-lg mb-4 text-gray-800">Contact Us</h3>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-3 py-2 outline-none"
            />
            <textarea
              rows={4}
              placeholder="Message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="border rounded px-3 py-2 resize-none outline-none"
            />
            <button
              type="submit"
              className="bg-[var(--mainColor)] text-white py-2 rounded hover:opacity-70 transition outline-none cursor-pointer"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
