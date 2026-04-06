import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  Lock,
  ExternalLink,
  Building2
} from "lucide-react";
import profileImage from "@/assets/ezhil-profile.jpg";
import heroBackground from "@/assets/hero-background.jpg";
import { PostDialog } from "@/components/PostDialog";
import { ServiceDetailDialog } from "@/components/ServiceDetailDialog";

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchPosts();

    // Realtime subscription for editable_content changes
    const channel = supabase
      .channel('editable-content-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'editable_content' },
        () => {
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
  const businessContent = content.business || { businesses: [], enabled: true };
  const servicesContent = content.services || { services: [], enabled: true };
  const experienceContent = content.experience || { enabled: true, items: [] };
  const featuredContent = content.featured || { enabled: true, items: [] };
  const certificationsContent = content.certifications || { enabled: true, items: [] };
  const skillsContent = content.skills || { enabled: true, items: [] };
  const educationContent = content.education || { enabled: true, items: [] };
  
  const heroBackgroundUrl = heroContent.backgroundImage || heroBackground;
  const profileImageUrl = heroContent.profileImage || profileImage;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Ezhil Nakharathinam</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="text-foreground hover:text-primary"
            >
              My Blog
            </Button>
            <Button 
              variant="ghost"
              onClick={() => navigate('/store')}
              className="text-foreground hover:text-primary"
            >
              Store
            </Button>
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
        </div>
      </header>

      {/* Hero Section with Background */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackgroundUrl})` }}
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
                  src={profileImageUrl} 
                  alt="Ezhil - Founder of EA Dream Supporters"
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-background shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standing Image Section */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="relative w-full max-w-md mx-auto min-h-[500px] rounded-2xl overflow-hidden shadow-xl">
            {heroContent.standingImage ? (
              <img 
                src={`${heroContent.standingImage}${heroContent.standingImage.includes('?') ? '&' : '?'}t=${Date.now()}`}
                alt="Ezhil - Standing Portrait"
                className="w-full h-full object-cover object-top"
                key={heroContent.standingImage}
              />
            ) : (
              <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">Standing image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      {posts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-10">Recent Posts</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Featured Post - Full Width */}
              <div className="lg:col-span-2">
                {featuredPost && (
                  <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all h-full">
                    {featuredPost.image_url && (
                      <img 
                        src={featuredPost.image_url} 
                        alt={featuredPost.title}
                        className="w-full h-80 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h3 className="text-3xl font-bold text-foreground mb-4">{featuredPost.title}</h3>
                    <p className="text-lg text-muted-foreground mb-4 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </Card>
                )}
              </div>

            </div>
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
                <h3 className="text-2xl font-bold text-foreground mb-6">Earlier Posts</h3>
                {sidebarPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="p-4 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setPostDialogOpen(true);
                    }}
                  >
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

      {/* My Business Section */}
      {businessContent.enabled !== false && (
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-5xl font-bold text-foreground">My Business</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessContent.businesses?.map((business: any, index: number) => (
              <Card 
                key={index} 
                className="p-6 border-0 shadow-md hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => business.website && window.open(business.website, '_blank')}
              >
                {business.logo && (
                  <img 
                    src={business.logo} 
                    alt={business.name}
                    className="w-20 h-20 object-contain mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  {business.name}
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </h3>
                <p className="text-foreground/70">{business.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Services */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-5xl font-bold text-foreground">Services & Contributions</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesContent.services?.length > 0 ? (
              servicesContent.services.map((service: any, index: number) => (
                <Card 
                  key={index} 
                  className="p-6 border-0 shadow-md hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => {
                    setSelectedService(service);
                    setServiceDialogOpen(true);
                  }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Building2 className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-foreground/70">{service.description}</p>
                </Card>
              ))
            ) : (
              [
                { icon: Calendar, title: "Preparation Management", desc: "Structured exam prep systems" },
                { icon: BookOpen, title: "Daily Schedule Planning", desc: "Personalized study schedules" },
                { icon: CheckCircle2, title: "Task Management", desc: "Track progress efficiently" },
                { icon: TrendingUp, title: "Productivity Tracking", desc: "Monitor student performance" },
                { icon: Award, title: "Mock Test Integration", desc: "Practice with real patterns" },
                { icon: Users, title: "Student Support", desc: "Motivation & guidance" }
              ].map((service, index) => (
                <Card key={index} className="p-6 border-0 shadow-md hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-foreground/70">{service.desc}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {experienceContent.enabled && experienceContent.items?.length > 0 && (
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-5xl font-bold text-foreground">Experience</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-8">
              {experienceContent.items.map((item: any, index: number) => (
                <Card key={index} className="p-8 border-l-4 border-primary">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-lg font-medium text-primary mb-2">{item.subtitle}</p>
                      )}
                      {item.location && (
                        <p className="text-sm text-muted-foreground mb-3">📍 {item.location}</p>
                      )}
                      <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                    </div>
                    {item.date && (
                      <div className="md:text-right">
                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {item.date}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Section */}
      {featuredContent.enabled && featuredContent.items?.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-5xl font-bold text-foreground">Featured</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.items.map((item: any, index: number) => (
                <Card key={index} className="p-6 border-0 shadow-md hover:shadow-xl transition-all group overflow-hidden">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-sm font-medium text-primary mb-2">{item.subtitle}</p>
                  )}
                  <p className="text-foreground/70">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certificationsContent.enabled && certificationsContent.items?.length > 0 && (
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-5xl font-bold text-foreground">Certifications</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {certificationsContent.items.map((item: any, index: number) => (
                <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-sm font-medium text-primary mb-2">{item.subtitle}</p>
                      )}
                      {item.location && (
                        <p className="text-sm text-muted-foreground mb-2">📍 {item.location}</p>
                      )}
                      {item.date && (
                        <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                      )}
                      <p className="text-foreground/70 text-sm">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skillsContent.enabled && skillsContent.items?.length > 0 && (
        <section className="py-16 px-4 bg-secondary/10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-5xl font-bold text-foreground">Skills</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillsContent.items.map((item: any, index: number) => (
                <Card key={index} className="p-6 border-0 shadow-sm hover:shadow-md transition-all text-center">
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {educationContent.enabled && educationContent.items?.length > 0 && (
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-5xl font-bold text-foreground">Education</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-6">
              {educationContent.items.map((item: any, index: number) => (
                <Card key={index} className="p-6 border-l-4 border-accent">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-lg font-medium text-accent mb-2">{item.subtitle}</p>
                      )}
                      {item.location && (
                        <p className="text-sm text-muted-foreground mb-3">📍 {item.location}</p>
                      )}
                      <p className="text-foreground/80">{item.description}</p>
                    </div>
                    {item.date && (
                      <div className="md:text-right">
                        <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                          {item.date}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {contactContent.instagram && (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open(contactContent.instagram, '_blank')}
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
            )}
            {contactContent.youtube && (
              <Button 
                size="lg" 
                className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open(contactContent.youtube, '_blank')}
              >
                <Youtube className="w-5 h-5 mr-2" />
                YouTube
              </Button>
            )}
            {contactContent.linkedin && (
              <Button 
                size="lg" 
                className="bg-[#0077B5] hover:bg-[#006097] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open(contactContent.linkedin, '_blank')}
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
            )}
            {contactContent.email && (
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-foreground/20 hover:border-primary hover:text-primary font-semibold px-8 py-6 text-lg rounded-full transition-all"
                onClick={() => window.location.href = `mailto:${contactContent.email}`}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-lg mb-2">
            Copyright © 2026 Ezhilmozhi.com
          </p>
          <p className="text-background/70">
            Designed with ❤️ by EZHIL
          </p>
        </div>
      </footer>

      <PostDialog 
        post={selectedPost}
        posts={posts}
        open={postDialogOpen}
        onOpenChange={setPostDialogOpen}
      />

      <ServiceDetailDialog 
        service={selectedService}
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
      />
    </div>
  );
};

export default Index;
