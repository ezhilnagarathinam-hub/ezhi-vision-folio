import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

interface SectionItem {
  title: string;
  subtitle?: string;
  description: string;
  date?: string;
  location?: string;
  image?: string;
}

interface SectionData {
  enabled: boolean;
  items: SectionItem[];
}

interface SectionManagerProps {
  sectionKey: string;
  sectionName: string;
  fields: {
    title: boolean;
    subtitle: boolean;
    description: boolean;
    date: boolean;
    location: boolean;
    image: boolean;
  };
}

const SectionManager = ({ sectionKey, sectionName, fields }: SectionManagerProps) => {
  const [sectionData, setSectionData] = useState<SectionData>({ enabled: true, items: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState<SectionItem>({
    title: '',
    subtitle: '',
    description: '',
    date: '',
    location: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('*')
        .eq('section_key', sectionKey)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.content) {
        const content = data.content as any;
        setSectionData({
          enabled: content.enabled ?? true,
          items: content.items ?? []
        });
      } else {
        await supabase
          .from('editable_content')
          .insert([{
            section_key: sectionKey,
            section_name: sectionName,
            content: { enabled: true, items: [] }
          }]);
      }
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

  const saveSection = async (updatedData: SectionData) => {
    try {
      const { error } = await supabase
        .from('editable_content')
        .upsert([{
          section_key: sectionKey,
          section_name: sectionName,
          content: updatedData as any
        }], { onConflict: 'section_key' });

      if (error) throw error;
      setSectionData(updatedData);
      toast({ title: `${sectionName} updated successfully` });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleToggle = (enabled: boolean) => {
    saveSection({ ...sectionData, enabled });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing !== null) {
      const updated = [...sectionData.items];
      updated[editing] = formData;
      saveSection({ ...sectionData, items: updated });
    } else {
      saveSection({ ...sectionData, items: [...sectionData.items, formData] });
    }
    
    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditing(index);
    setFormData(sectionData.items[index]);
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const updated = sectionData.items.filter((_, i) => i !== index);
    saveSection({ ...sectionData, items: updated });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      date: '',
      location: '',
      image: ''
    });
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Section Settings</h2>
          <div className="flex items-center gap-3">
            <Label htmlFor="section-toggle">Display on site</Label>
            <Switch
              id="section-toggle"
              checked={sectionData.enabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editing !== null ? 'Edit Item' : 'Add New Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.title && (
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          )}

          {fields.subtitle && (
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
          )}

          {fields.description && (
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
          )}

          {fields.date && (
            <div className="space-y-2">
              <Label htmlFor="date">Date/Period</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g., 2020 - 2024"
              />
            </div>
          )}

          {fields.location && (
            <div className="space-y-2">
              <Label htmlFor="location">Location/Organization</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          )}

          {fields.image && (
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editing !== null ? 'Update Item' : 'Add Item'}
            </Button>
            {editing !== null && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Items</h2>
        {sectionData.items.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No items yet. Add your first item above.
          </Card>
        ) : (
          <div className="grid gap-4">
            {sectionData.items.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm font-medium text-primary mb-2">{item.subtitle}</p>
                    )}
                    {item.date && (
                      <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                    )}
                    {item.location && (
                      <p className="text-sm text-muted-foreground mb-2">📍 {item.location}</p>
                    )}
                    <p className="text-muted-foreground">{item.description}</p>
                    {item.image && (
                      <p className="text-xs text-muted-foreground mt-2">📷 Image attached</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionManager;
