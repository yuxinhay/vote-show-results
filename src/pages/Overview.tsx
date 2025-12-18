import { useState } from "react";
import { Users, Lightbulb, Palette, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterestRegistrationDialog } from "@/components/InterestRegistrationDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Overview = () => {
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleInterestClick = () => {
    setShowInterestDialog(true);
  };
  
  const roles = [{
    title: "Product Sponsor",
    icon: Users,
    responsibilities: ["Shaping the product vision and direction, in a way that aligns with business objectives", "Providing subject matter expertise and insights on how the product should integrate with the sponsoring dept's existing systems", "Making key decisions at critical stages of development, such as on features to prioritise", "Deciding whether to pursue product development further after the MIC Programme"]
  }, {
    title: "Hustler (Product Manager)",
    icon: Lightbulb,
    responsibilities: ["Conduct research to scope the problem and solution", "Lead stakeholders engagement and presentation (although all members can present)", "Organise and set agenda for weekly team meetings, including managing deadlines"]
  }, {
    title: "Hipster (Designer)",
    icon: Palette,
    responsibilities: ["Designs creatively and ideates the final product", "Develop product design to deliver a satisfactory user experience", "Recruit testers and conduct user testing", "Create marketing materials, including logo, decks, etc."]
  }, {
    title: "Hacker (Developer)",
    icon: Code,
    responsibilities: ["Build prototype based on requirements from Sponsor and team findings", "Understand and incorporate considerations on cloud services, required integrations, data security, etc."]
  }];
  
  const contributions = [{
    title: "Submit a Problem Statement",
    description: "See a workplace challenge worth solving? Submit your problem statement – that's the crucial first step. Think about the daily friction points, manual processes that eat up time, information scattered across multiple systems, or tasks that require endless back-and-forth. If you're excited about being part of the solution, we'd love to have you join the team to bring your idea to life! Your contribution could transform how we work at CPFB."
  }, {
    title: "Vote for Problem Statements",
    description: "Review the problem statements submitted by your colleagues and upvote the ones that resonate most with you. You can also comment on submissions, whether to share similar experiences, ask clarifying questions, or suggest possible solutions if you know of existing tools or approaches that might help. Your votes and insights help us prioritise the challenges that matter most to staff."
  }, {
    title: "Join as a MIC Participant",
    description: "Once problem statements are finalised, you'll have the opportunity to join a product team and work on developing solutions. Whether you're a problem solver, designer, developer, or simply passionate about innovation, there's a role for you in MIC."
  }, {
    title: "Support the MIC Programme",
    description: "Even if you're not directly involved in a MIC product team, you can still be part of MIC. Attend Pitch Day and Demo Day to see what's being built and stay connected to innovation happening across the board. You can also provide feedback on the teams' prototypes and champion the innovative spirit within your department!"
  }];
  
  return (
    <div className="p-8 space-y-10 max-w-5xl mx-auto">
      {/* Main Header */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">The Made-in-CPF (MIC) Programme</h1>
        <p className="text-lg leading-relaxed text-foreground">
          The Made-in-CPF (MIC) Programme is a 10-week long intrapreneurship programme that empowers staff to prototype
          products to solve workplace challenges. Designed to accelerate innovation within the Board, MIC has
          successfully completed four seasons to date!
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="leading-relaxed text-foreground">
          Product teams receive protected time across 10 weeks to take full ownership of a problem statement and develop
          a working prototype of an in-house digital solution. Teams must pass two critical milestones - Pitch Day,
          where they convince EXCO of their idea's feasibility and potential benefits, and subsequently at Demo Day,
          where they demonstrate a functional prototype and its measurable impact.
        </p>
      </section>

      {/* Who should participate */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Who should participate?</h2>
          <p className="text-foreground">
            The programme is open to all CPFB staff. Each product team comprises of 4 key roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(role => (
            <Card key={role.title} className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <role.icon className="h-5 w-5 text-primary" />
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {role.responsibilities.map((resp, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-primary font-medium">{String.fromCharCode(97 + index)}.</span>
                      <span className="text-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How can you contribute */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How can you contribute to MIC?</h2>

        <div className="space-y-6">
          {contributions.map(item => (
            <div key={item.title} className="space-y-2">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="leading-relaxed text-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button size="lg" className="w-full md:w-auto" onClick={handleInterestClick}>
            Yes, I'm interested to be part of the solutioning team!
          </Button>
        </div>
      </section>

      <InterestRegistrationDialog open={showInterestDialog} onOpenChange={setShowInterestDialog} />

      {/* Footer */}
      <footer className="text-center py-4 border-t border-border">
        <p className="text-sm text-gray-600">
          Submissions close on <span className="font-semibold text-foreground">31 December 2025</span>. Winners will be
          announced in January 2026.
        </p>
      </footer>
    </div>
  );
};

export default Overview;
