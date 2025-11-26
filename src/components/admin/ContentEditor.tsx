import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentSection {
  id: string;
  section_key: string;
  section_name: string;
  content: any;
}

const ContentEditor = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('*');

      if (error) throw error;
      setSections(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionKey: string, newContent: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('editable_content')
        .update({ content: newContent })
        .eq('section_key', sectionKey);

      if (error) throw error;

      toast({ title: "Content updated successfully" });
      fetchContent();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpdate = (section: ContentSection) => {
    const content = section.content;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-name">Name</Label>
          <Input
            id="hero-name"
            defaultValue={content.name}
            onBlur={(e) => {
              if (e.target.value !== content.name) {
                updateSection(section.section_key, { ...content, name: e.target.value });
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-role">Role</Label>
          <Input
            id="hero-role"
            defaultValue={content.role}
            onBlur={(e) => {
              if (e.target.value !== content.role) {
                updateSection(section.section_key, { ...content, role: e.target.value });
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-desc">Description</Label>
          <Textarea
            id="hero-desc"
            rows={3}
            defaultValue={content.description}
            onBlur={(e) => {
              if (e.target.value !== content.description) {
                updateSection(section.section_key, { ...content, description: e.target.value });
              }
            }}
          />
        </div>
      </div>
    );
  };

  const handleAboutUpdate = (section: ContentSection) => {
    const content = section.content;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="about-text">About Text</Label>
          <Textarea
            id="about-text"
            rows={5}
            defaultValue={content.text}
            onBlur={(e) => {
              if (e.target.value !== content.text) {
                updateSection(section.section_key, { ...content, text: e.target.value });
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Highlights (one per line)</Label>
          <Textarea
            rows={6}
            defaultValue={content.highlights?.join('\n') || ''}
            onBlur={(e) => {
              const newHighlights = e.target.value.split('\n').filter(h => h.trim());
              if (JSON.stringify(newHighlights) !== JSON.stringify(content.highlights)) {
                updateSection(section.section_key, { ...content, highlights: newHighlights });
              }
            }}
          />
        </div>
      </div>
    );
  };

  const handleSimpleTextUpdate = (section: ContentSection, label: string) => {
    const content = section.content;
    return (
      <div className="space-y-2">
        <Label htmlFor={section.section_key}>{label}</Label>
        <Textarea
          id={section.section_key}
          rows={3}
          defaultValue={content.text}
          onBlur={(e) => {
            if (e.target.value !== content.text) {
              updateSection(section.section_key, { ...content, text: e.target.value });
            }
          }}
        />
      </div>
    );
  };

  const handleContactUpdate = (section: ContentSection) => {
    const content = section.content;
    return (
      <div className="space-y-4">
        {Object.keys(content).map((key) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`contact-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
            <Input
              id={`contact-${key}`}
              type="url"
              defaultValue={content[key]}
              onBlur={(e) => {
                if (e.target.value !== content[key]) {
                  updateSection(section.section_key, { ...content, [key]: e.target.value });
                }
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Site Content</h2>
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.section_key} className="mt-6">
              <div className="space-y-4">
                {section.section_key === 'hero' && handleHeroUpdate(section)}
                {section.section_key === 'about' && handleAboutUpdate(section)}
                {section.section_key === 'mission' && handleSimpleTextUpdate(section, 'Mission Statement')}
                {section.section_key === 'vision' && handleSimpleTextUpdate(section, 'Vision Statement')}
                {section.section_key === 'contact' && handleContactUpdate(section)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
      <p className="text-sm text-muted-foreground">
        * Changes are saved automatically when you click away from a field
      </p>
    </div>
  );
};

export default ContentEditor;
