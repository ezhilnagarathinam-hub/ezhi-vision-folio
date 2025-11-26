import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  Target, 
  Users, 
  TrendingUp, 
  Award,
  Heart,
  Globe,
  Lightbulb,
  CheckCircle2,
  Instagram,
  Youtube,
  Send,
  MessageCircle,
  Mail
} from "lucide-react";
import profileImage from "@/assets/ezhil-profile.jpg";

const Index = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-7xl md:text-8xl font-bold text-foreground tracking-tight">
                  Ezhil
                </h1>
                <p className="text-2xl text-muted-foreground font-medium">
                  Founder, EA Dream Supporters
                </p>
              </div>
              
              <p className="text-xl text-foreground/80 leading-relaxed max-w-xl">
                Educationist • Entrepreneur • Productivity Mentor.
                <br />
                Helping students achieve their dream exams with scientific preparation management.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={() => scrollToSection('about')}
                >
                  About Me
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-foreground/20 hover:border-primary hover:text-primary font-semibold px-8 py-6 text-lg rounded-full transition-all"
                  onClick={() => scrollToSection('contact')}
                >
                  Let's Connect
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-full blur-3xl opacity-20"></div>
                <img 
                  src={profileImage} 
                  alt="Ezhil - Founder of EA Dream Supporters"
                  className="relative w-80 h-80 md:w-96 md:h-96 rounded-full object-cover border-4 border-background shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground">About Ezhil</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <Card className="p-8 md:p-12 bg-card border-0 shadow-lg">
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
                Ezhil is the founder of <span className="text-primary font-semibold">EA Dream Supporters</span>, an EdTech startup transforming competitive exam preparation through structured preparation management, personalized scheduling, and scientific productivity systems. Known for simplicity, clarity, and high-impact execution, Ezhil helps aspirants reduce preparation timelines and stay focused.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Heart, text: "Simple and disciplined life approach" },
                  { icon: Globe, text: "Deep interest in cultures & global knowledge" },
                  { icon: BookOpen, text: "Love for teaching and mentoring" },
                  { icon: Target, text: "Mission-driven entrepreneur" },
                  { icon: Lightbulb, text: "Author & content creator" },
                  { icon: Users, text: "Student-first mindset" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-all">
                    <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-foreground/90">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Founder Story</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-8">
            {[
              { 
                title: "The Spark", 
                description: "Started with a simple idea: helping students prepare smarter, not harder.",
                year: "Beginning"
              },
              { 
                title: "Building Systems", 
                description: "Developed a comprehensive preparation management system based on scientific productivity principles.",
                year: "Development"
              },
              { 
                title: "First Successes", 
                description: "Helped early students complete their syllabus months faster with structured planning.",
                year: "Validation"
              },
              { 
                title: "Full Ecosystem", 
                description: "Expanded into a complete EdTech platform with task management, mock tests, and student support.",
                year: "Growth"
              },
              { 
                title: "Vision Forward", 
                description: "Aiming to make preparation management the standard for competitive exams across India.",
                year: "Future"
              }
            ].map((milestone, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  {index < 4 && <div className="w-0.5 flex-1 bg-primary/30 mt-2"></div>}
                </div>
                <Card className="flex-1 p-6 border-0 shadow-md hover:shadow-xl transition-all mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-foreground">{milestone.title}</h3>
                    <span className="text-sm font-semibold text-primary mt-2 md:mt-0">{milestone.year}</span>
                  </div>
                  <p className="text-foreground/70 text-lg">{milestone.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Mission & Vision</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-10 bg-card border-0 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Mission</h3>
              </div>
              <p className="text-xl text-foreground/80 leading-relaxed">
                "To help every student learn smarter, prepare better, and achieve their dream exam with confidence."
              </p>
            </Card>
            
            <Card className="p-10 bg-card border-0 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Vision</h3>
              </div>
              <p className="text-xl text-foreground/80 leading-relaxed">
                "To make preparation management a standard system for all competitive exams in India."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Services & Contributions</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: "Preparation Management", desc: "Structured exam prep systems" },
              { icon: BookOpen, title: "Daily Schedule Planning", desc: "Personalized study schedules" },
              { icon: CheckCircle2, title: "Task Management", desc: "Track progress efficiently" },
              { icon: TrendingUp, title: "Productivity Tracking", desc: "Monitor student performance" },
              { icon: Award, title: "Mock Test Integration", desc: "Practice with real patterns" },
              { icon: Users, title: "Student Support", desc: "Motivation & guidance" },
              { icon: Lightbulb, title: "EdTech Innovation", desc: "Cutting-edge solutions" }
            ].map((service, index) => (
              <Card key={index} className="p-6 border-0 shadow-md hover:shadow-xl transition-all group cursor-pointer">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-foreground/70">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Achievements</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Helped a UPSC student complete preparation in 3 months",
              "Built EA Dream Supporters ecosystem from scratch",
              "Created scalable systems: PM, TM, SM, Productivity Team",
              "Collaboration planning with India's top institutes",
              "Positive results & improved student timelines",
              "Developed comprehensive EdTech solutions for aspirants"
            ].map((achievement, index) => (
              <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-lg text-foreground/90 leading-relaxed">{achievement}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Values */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Leadership Values</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Simplicity",
              "Consistency",
              "Responsibility",
              "Cultural appreciation",
              "Problem-solving",
              "Student-first approach",
              "Innovation",
              "Integrity"
            ].map((value, index) => (
              <Card key={index} className="p-6 text-center border-0 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                <p className="text-lg font-semibold text-foreground">{value}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Want to collaborate or learn more?
          </h2>
          <p className="text-xl text-foreground/70 mb-12">
            Let's connect and discuss how we can help students achieve their dreams together.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://instagram.com', '_blank')}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </Button>
            <Button 
              size="lg" 
              className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://youtube.com', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              YouTube
            </Button>
            <Button 
              size="lg" 
              className="bg-[#0088cc] hover:bg-[#006699] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://telegram.org', '_blank')}
            >
              <Send className="w-5 h-5 mr-2" />
              Telegram
            </Button>
            <Button 
              size="lg" 
              className="bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://whatsapp.com', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-foreground/20 hover:border-primary hover:text-primary font-semibold px-8 py-6 text-lg rounded-full transition-all"
              onClick={() => window.location.href = 'mailto:contact@eadreamsupporters.com'}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-lg mb-2">
            Copyright © {new Date().getFullYear()} Ezhil | EA Dream Supporters
          </p>
          <p className="text-background/70">
            Designed with ❤️ using Lovable
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
