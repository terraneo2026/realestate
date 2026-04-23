"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Navbar, Footer, PageHero } from "@/components/layout";
import { firestore } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { Facebook, Instagram, Twitter, Linkedin, ChevronDown, ChevronUp, Phone, Mail, MapPin } from "lucide-react";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to Firestore 'enquiries' collection (unified with admin panel)
      await addDoc(collection(firestore, "enquiries"), {
        userName: formData.name,
        userEmail: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: "General Inquiry",
        type: 'contact',
        source: 'Web Form',
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString()
      });
      
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Failed to submit contact form to Firestore:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <PageHero 
          title="Let's Connect" 
          description="Whether you're looking to buy, sell, or just have a quick question, our team of experts is here to guide you every step of the way."
          backgroundImage="https://images.unsplash.com/photo-1596422846543-75c6ff416d66?q=80&w=2070&auto=format&fit=crop"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-8 tracking-tight relative z-10">Contact information</h3>
                
                <div className="space-y-10 relative z-10">
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 bg-[#087C7C]/10 rounded-2xl flex items-center justify-center text-[#087C7C] flex-shrink-0 group-hover:bg-[#087C7C] group-hover:text-white transition-all shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">Direct line</p>
                      <a href="tel:8125384888" className="text-base font-bold text-gray-800 hover:text-primary transition-colors tracking-tight">
                        +91 81253 84888
                      </a>
                    </div>
                  </div>
 
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 bg-[#087C7C]/10 rounded-2xl flex items-center justify-center text-[#087C7C] flex-shrink-0 group-hover:bg-[#087C7C] group-hover:text-white transition-all shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">Email support</p>
                      <a href="mailto:drrealty9@gmail.com" className="text-base font-bold text-gray-800 hover:text-primary transition-colors tracking-tight">
                        drrealty9@gmail.com
                      </a>
                    </div>
                  </div>
 
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 bg-[#087C7C]/10 rounded-2xl flex items-center justify-center text-[#087C7C] flex-shrink-0 group-hover:bg-[#087C7C] group-hover:text-white transition-all shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">Main office</p>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed tracking-tight">
                        M-40, CoKarma, Gandipet Road,<br />
                        Kokapet, Hyderabad-500075
                      </p>
                    </div>
                  </div>
                </div>
 
                <div className="mt-12 pt-10 border-t border-gray-50 relative z-10">
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-6">Join our social network</h4>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, name: 'Facebook', href: 'https://facebook.com' },
                      { icon: Twitter, name: 'X', href: 'https://twitter.com' },
                      { icon: Instagram, name: 'Instagram', href: 'https://instagram.com' },
                      { icon: Linkedin, name: 'Linkedin', href: 'https://linkedin.com' }
                    ].map((social) => (
                      <a 
                        key={social.name} 
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-50 hover:bg-primary hover:text-white rounded-xl flex items-center justify-center text-gray-400 transition-all shadow-sm"
                        aria-label={social.name}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">Send us a Message</h3>
                <p className="text-gray-500 mb-8 text-base font-normal">Fill out the form below and we'll get back to you within 24 hours.</p>

                {submitted && (
                  <div className="mb-8 p-6 bg-green-50 text-green-700 rounded-2xl border border-green-200 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-lg">Message Sent Successfully!</p>
                      <p className="text-sm font-normal">Thank you for reaching out. Our team will contact you shortly.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-base font-normal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-base font-normal"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (234) 567-8900"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-base font-normal"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Your Message</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Tell us about your property needs..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all resize-none text-base font-normal leading-relaxed"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                  >
                    Send Message 🚀
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 leading-tight">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-base font-normal leading-relaxed">Quick answers to common questions about our services.</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "How do I list my property?", a: "You can register as an owner or agent and use the dashboard to list your properties with photos and details." },
                { q: "Are there any hidden fees?", a: "No, we are transparent about our pricing. Any service fees will be clearly communicated during the process." },
                { q: "How can I schedule a viewing?", a: "Once you find a property you like, use the contact button on the property details page to reach out to the agent." },
                { q: "What locations do you cover?", a: "We currently operate in major cities across India, including Mumbai, Delhi, Bangalore, and Chennai." }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl border transition-all duration-300 ${openFaqIndex === index ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/50'}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-lg font-semibold text-gray-900">{faq.q}</span>
                    <span className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${openFaqIndex === index ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'}`}>
                      {openFaqIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-gray-600 text-base leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Google Maps Section */}
          <section className="mt-24 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="p-8 md:p-10 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">Find Us on the Map</h2>
              <p className="text-gray-500 text-base font-normal">Visit our main office located in the heart of Hyderabad.</p>
            </div>
            <div className="w-full h-[400px] md:h-[500px] bg-gray-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.6180327668695!2d78.33037037583695!3d17.382103502958447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95420b9e8cdb%3A0xc3c1e285a210d7a0!2sCoKarma%20-%20Coworking%20Space%20in%20Kokapet!5e0!3m2!1sen!2sin!4v1708420000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Relocate Office Location"
                className="absolute inset-0"
              ></iframe>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
