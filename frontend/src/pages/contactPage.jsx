import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-green-100 rounded-2xl font-sans antialiased flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ContactUsPage />
    </div>
  );
}

function ContactUsPage() {
  const form = useRef();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await emailjs.sendForm(
        'service_vizeykc',
        'template_ydmf3sk',
        form.current,
        'yNwilRLIguxxVs8Wj');
      console.log('EmailJS Result:', result.text);

      if (result.text === 'OK') {
        setStatusMessage('Thank you for your message! We will get back to you soon.');
        setFormData({
          user_name: '',
          user_email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      setStatusMessage('Failed to send message. Please try again later.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center  mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-primary mb-4 ">
          Connect With Us
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're here to help! Reach out with any questions, feedback, or collaboration ideas. We value your input.
        </p>
      </div>

      <div className="md:grid  flex flex-col-reverse md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-300 pb-3">Get in Touch</h2>

          <div className="space-y-6">
            <div className="flex iteams-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
              <svg className="h-7 w-7 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7m3 4l4.5 3L18 12" />
              </svg>
              <div>
                <p className="text-lg font-semibold text-gray-900">Email Us</p>
                <a href="mailto:unibazarmmmut@gmail.com" className="text-indigo-600 hover:text-indigo-800 text-base transition-colors duration-200">unibazarmmmut@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
              <svg className="h-7 w-7 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-lg font-semibold text-gray-900">Call Us</p>
                <a href="tel:+919336651494" className="text-indigo-600 hover:text-indigo-800 text-base transition-colors duration-200">+91 9336651494</a>
                <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 5 PM (IST)</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
              <svg className="h-7 w-7 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-lg font-semibold text-gray-900">Our Office</p>
                <address className="text-base text-gray-600 not-italic">
                  MMMUT <br />
                  Gorakhpur, Uttar Pradesh 273010
                </address>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-300 pb-3 mb-6">Send Us a Message</h2>
          {statusMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-fadeIn flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {statusMessage}
            </div>
          )}

          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-400"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-400"
                  placeholder="Regarding..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 ease-in-out hover:border-indigo-400"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-primary hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}