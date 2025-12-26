import { useState } from "react";
import { Users, Lightbulb, Palette, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterestRegistrationDialog } from "@/components/InterestRegistrationDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Overview = () => {
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [showCoachDialog, setShowCoachDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleInterestClick = () => {
    setShowInterestDialog(true);
  };

  const handleCoachConfirm = () => {
    setShowCoachDialog(false);
    toast.success("Thank you for your interest in becoming a MIC Coach! We will be in touch soon.");
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

        {/* Submit a Problem Statement */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{contributions[0].title}</h3>
          <p className="leading-relaxed text-foreground">{contributions[0].description}</p>
        </div>

        {/* Vote for Problem Statements */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{contributions[1].title}</h3>
          <p className="leading-relaxed text-foreground">{contributions[1].description}</p>
        </div>

        {/* Join as a MIC Participant */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{contributions[2].title}</h3>
          <p className="leading-relaxed text-foreground">{contributions[2].description}</p>
          <div className="pt-2">
            <Button size="lg" className="w-full md:w-auto" onClick={handleInterestClick}>
              I'm interested to be a MIC participant!
            </Button>
          </div>
        </div>

        {/* Join as a MIC Coach */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Join as a MIC Coach</h3>
          <p className="leading-relaxed text-foreground">
            Support innovation by becoming a MIC coach. Coaches play a vital role in guiding product teams through their MIC journey, helping them navigate challenges, refine their ideas, and stay on track to deliver impactful solutions. If you have experience in project management, or simply a passion for mentoring others, consider joining as a coach to help shape the next generation of innovators at CPFB.
          </p>
          <div className="pt-2">
            <Button size="lg" className="w-full md:w-auto" onClick={() => setShowCoachDialog(true)}>
              I'm interested to be a MIC Coach!
            </Button>
          </div>
        </div>

        {/* Support the MIC Programme */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{contributions[3].title}</h3>
          <p className="leading-relaxed text-foreground">{contributions[3].description}</p>
        </div>
      </section>

      <InterestRegistrationDialog open={showInterestDialog} onOpenChange={setShowInterestDialog} />

      <AlertDialog open={showCoachDialog} onOpenChange={setShowCoachDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Interest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to register your interest as a MIC Coach? By confirming, you'll be expressing your commitment to guide and mentor product teams throughout their MIC journey.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCoachConfirm}>Yes, I'm interested!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Overview;
