"use client";

import { toastStyle } from '@/components/toastNotification';
import React, { forwardRef, useState } from 'react';
import { toast } from 'react-toastify';

const LeadForm = forwardRef((_, ref) => {

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    countryCode: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Name is required", toastStyle);
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone is required", toastStyle);
      return false;
    } else if (!/^\+?\d[\d\s]{9,19}$/.test(formData.phone.trim())) {
      toast.error("Enter a valid phone number", toastStyle);
      return false;
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
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {

      const fullPhone = formData.countryCode + formData.phone;

      const payload = {
        fname: formData.fullName,
        email: formData.email,
        number: fullPhone,
        message: formData.message,
        page_url: window.location.href,
      };

      // console.log(payload);

      const response = await fetch('https://8kb7ux2337.execute-api.ap-south-1.amazonaws.com/createlead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast("Form submission succeeded", toastStyle);

      setFormData({
        fullName: "",
        email: "",
        countryCode: "",
        phone: "",
        message: "",
      });

    } catch (error) {
      const errorMessage = error.message || "Form submission failed. Please try again.";
      toast.error(errorMessage, toastStyle);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-blue-600 p-6">
        <h3 className="text-xl font-bold text-white">Submit your request</h3>
        <p className="text-blue-100">Fill the form below and our team will contact you shortly</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="w-full px-4 py-2 border border-[#e4e4e4] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 inputName"
              placeholder="John Doe"
              ref={ref}
              onChange={handleChange}
              value={formData.fullName}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 border border-[#e4e4e4] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@company.com"
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                id="countryCode"
                className="w-1/4 px-4 py-2 border border-[#e4e4e4] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.countryCode}
              >
                <option value="+91">+91 (IN)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+1">+1 (US)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+86">+86 (CN)</option>
              </select>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="w-3/4 px-4 py-2 border border-[#e4e4e4] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(123) 456-7890"
                onChange={handleChange}
                value={formData.phone}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              id="message"
              className="w-full px-4 py-2 border border-[#e4e4e4] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Tell us about your requirements..."
              onChange={handleChange}
              value={formData.message}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
});

export default LeadForm;