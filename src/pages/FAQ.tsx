import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const faqs = [{
  question: 'What is a pain point?',
  answer: 'A pain point is a workplace challenge or issue that affects your productivity, well-being, or overall work experience. It could be anything from process inefficiencies to communication gaps.'
}, {
  question: 'How do I submit a problem statement?',
  answer: 'Click on the "Submit Problem" button in the Pain Points section. Fill in the details about your workplace challenge and submit it for review.'
}, {
  question: 'Why do submissions need to be approved?',
  answer: 'Submissions go through a review process to ensure they are appropriate, constructive, and relevant to workplace improvement.'
}, {
  question: 'Can others see who submitted a problem?',
  answer: 'Yes, your name will be displayed with your submission to encourage accountability and constructive dialogue.'
}, {
  question: 'How does voting work?',
  answer: 'Each user can upvote a pain point once. The vote count helps prioritize which issues are most important to the community.'
}, {
  question: 'What happens after submission?',
  answer: 'Your submission will be reviewed by administrators. Once approved, it will appear on the main page for others to view and vote on.'
}, {
  question: 'How can I win the $10 GovWallet prize?',
  answer: 'Submit your problem statements or actively participate by upvoting others\' submissions. Winners will be randomly selected from participants and announced in January 2026.'
}];
const FAQ = () => {
  return <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-2 text-secondary">
          Find answers to common questions about the Pain Points platform.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full max-w-3xl">
        {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>)}
      </Accordion>
    </div>;
};
export default FAQ;