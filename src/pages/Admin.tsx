import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LogOut, Loader2 } from 'lucide-react';
import PostsManager from '@/components/admin/PostsManager';
import ContentEditor from '@/components/admin/ContentEditor';
import BusinessManager from '@/components/admin/BusinessManager';
import ServicesManager from '@/components/admin/ServicesManager';
import SectionManager from '@/components/admin/SectionManager';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Site
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-max">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="posts" className="mt-6">
            <PostsManager />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <BusinessManager />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <SectionManager 
              sectionKey="experience"
              sectionName="Experience"
              fields={{
                title: true,
                subtitle: true,
                description: true,
                date: true,
                location: true,
                image: false
              }}
            />
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            <SectionManager 
              sectionKey="featured"
              sectionName="Featured"
              fields={{
                title: true,
                subtitle: true,
                description: true,
                date: false,
                location: false,
                image: true
              }}
            />
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <SectionManager 
              sectionKey="certifications"
              sectionName="Certifications"
              fields={{
                title: true,
                subtitle: true,
                description: true,
                date: true,
                location: true,
                image: true
              }}
            />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SectionManager 
              sectionKey="skills"
              sectionName="Skills"
              fields={{
                title: true,
                subtitle: false,
                description: true,
                date: false,
                location: false,
                image: false
              }}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <SectionManager 
              sectionKey="education"
              sectionName="Education"
              fields={{
                title: true,
                subtitle: true,
                description: true,
                date: true,
                location: true,
                image: false
              }}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
