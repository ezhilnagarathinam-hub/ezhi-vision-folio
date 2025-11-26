import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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
  Linkedin,
  Mail,
  LogIn,
  Lock
} from "lucide-react";
import profileImage from "@/assets/ezhil-profile.jpg";
import heroBackground from "@/assets/hero-background.jpg";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

interface ContentSection {
  section_key: string;
  content: any;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState<Record<string, any>>({});
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
    fetchPosts();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase
      .from('editable_content')
      .select('*');

    if (data) {
      const contentMap: Record<string, any> = {};
      data.forEach((item: ContentSection) => {
        contentMap[item.section_key] = item.content;
      });
      setContent(contentMap);
    }
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1);

  const heroContent = content.hero || {};
  const aboutContent = content.about || {};
  const missionContent = content.mission || {};
  const visionContent = content.vision || {};
  const contactContent = content.contact || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Ezhil</h1>
          {user ? (
            <Button 
              onClick={() => navigate('/admin')}
              className="bg-primary hover:bg-primary/90"
            >
              {isAdmin ? <Lock className="w-4 h-4 mr-2" /> : null}
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section with Background */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-7xl md:text-8xl font-bold text-foreground tracking-tight">
                  {heroContent.name || 'Ezhil'}
                </h1>
                <p className="text-2xl text-foreground/90 font-medium">
                  {heroContent.role || 'Founder, EA Dream Supporters'}
                </p>
              </div>
              
              <p className="text-xl text-foreground/80 leading-relaxed max-w-xl">
                {heroContent.description || 'Educationist • Entrepreneur • Productivity Mentor. Helping students achieve their dream exams with scientific preparation management.'}
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

      {/* Posts Section */}
      {featuredPost && (
        <section className="py-12 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Recent Posts</h2>
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all">
              {featuredPost.image_url && (
                <img 
                  src={featuredPost.image_url} 
                  alt={featuredPost.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h3 className="text-3xl font-bold text-foreground mb-4">{featuredPost.title}</h3>
              <p className="text-lg text-foreground/70 mb-4">{featuredPost.excerpt}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(featuredPost.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </Card>
          </div>
        </section>
      )}

      {/* Main Content with Sidebar */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* About Section */}
            <section id="about">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold text-foreground">About Ezhil</h2>
                  <div className="w-24 h-1 bg-primary rounded-full"></div>
                </div>
                
                <Card className="p-8 bg-card border-0 shadow-lg">
                  <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
                    {aboutContent.text}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {aboutContent.highlights?.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-all">
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <p className="text-foreground/90">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            {/* Mission & Vision */}
            <section className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-background border-0 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Mission</h3>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  "{missionContent.text}"
                </p>
              </Card>
              
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-background border-0 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Vision</h3>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  "{visionContent.text}"
                </p>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          {sidebarPosts.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <h3 className="text-2xl font-bold text-foreground mb-6">More Posts</h3>
                {sidebarPosts.map((post) => (
                  <Card key={post.id} className="p-4 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer">
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-bold text-foreground mb-2">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Services */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-5xl font-bold text-foreground">Services & Contributions</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: "Preparation Management", desc: "Structured exam prep systems" },
              { icon: BookOpen, title: "Daily Schedule Planning", desc: "Personalized study schedules" },
              { icon: CheckCircle2, title: "Task Management", desc: "Track progress efficiently" },
              { icon: TrendingUp, title: "Productivity Tracking", desc: "Monitor student performance" },
              { icon: Award, title: "Mock Test Integration", desc: "Practice with real patterns" },
              { icon: Users, title: "Student Support", desc: "Motivation & guidance" }
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
              onClick={() => window.open(contactContent.instagram || 'https://instagram.com', '_blank')}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </Button>
            <Button 
              size="lg" 
              className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open(contactContent.youtube || 'https://youtube.com', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              YouTube
            </Button>
            <Button 
              size="lg" 
              className="bg-[#0077B5] hover:bg-[#006097] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open(contactContent.linkedin || 'https://linkedin.com', '_blank')}
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-foreground/20 hover:border-primary hover:text-primary font-semibold px-8 py-6 text-lg rounded-full transition-all"
              onClick={() => window.location.href = `mailto:${contactContent.email || 'contact@eadreamsupporters.com'}`}
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
