import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../../components/GlassCard';
import { RoundedButton } from '../../components/RoundedButton';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, HelpCircle, MessageSquare, Book, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

export function HelpSupport() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Support ticket submitted successfully');
    setContactForm({ subject: '', message: '' });
  };

  const faqs = [
    {
      question: 'How do I set my shopping budget?',
      answer: 'You can set your budget on the home screen before shopping, or configure default budgets in Settings > Budget Settings.'
    },
    {
      question: 'What happens if I exceed my budget?',
      answer: 'You\'ll receive a warning notification when you reach your budget threshold. The system will alert you to remove items before checkout.'
    },
    {
      question: 'How does the IoT scanner work?',
      answer: 'The IoT scanner automatically detects products as you place them in your cart. Simply click "Simulate Scan" to test the feature.'
    },
    {
      question: 'Can I view my purchase history?',
      answer: 'Yes, admins can view detailed purchase history and reports in the Admin Dashboard under the Reports section.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to Settings > Profile Settings to update your name, email, phone number, and address.'
    }
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#0a1f14] via-[#1b4d2e] to-[#0a1f14]">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <RoundedButton
            onClick={() => navigate('/settings')}
            variant="secondary"
            className="!px-4 !py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </RoundedButton>
        </div>

        <GlassCard className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#2d5a3f]/50 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-[#fdf5e6]" />
            </div>
            <div>
              <h1 className="text-[#fdf5e6]">Help & Support</h1>
              <p className="text-[#fdf5e6]/70 text-sm">Get help and contact support</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2">
            <Book className="w-5 h-5" />
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-[#fdf5e6]/20">
                <AccordionTrigger className="text-[#fdf5e6] hover:text-[#fdf5e6]/80">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#fdf5e6]/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-[#fdf5e6] mb-2 block">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-[#fdf5e6] mb-2 block">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={6}
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
            <RoundedButton onClick={handleSubmit} className="w-full">
              Submit Ticket
            </RoundedButton>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-[#fdf5e6] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </h3>
          <div className="space-y-2 text-[#fdf5e6]/70">
            <p>Email: <span className="text-[#fdf5e6]">support@cartsense.com</span></p>
            <p>Phone: <span className="text-[#fdf5e6]">1-800-CART-SENSE</span></p>
            <p>Hours: <span className="text-[#fdf5e6]">Mon-Fri, 9AM-6PM EST</span></p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
