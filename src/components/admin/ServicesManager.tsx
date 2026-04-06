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

interface Service {
  title: string;
  description: string;
  content: string;
  images?: string[];
  videos?: string[];
}

const ServicesManager = () => {
  const [enabled, setEnabled] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    images: '',
    videos: ''
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
        .eq('section_key', 'services')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const content = data.content as { services?: Service[]; enabled?: boolean };
        setServices(content.services || []);
        setEnabled(content.enabled !== false);
      } else {
        // Create initial record if it doesn't exist
        await supabase
          .from('editable_content')
          .insert([{
            section_key: 'services',
            section_name: 'Services & Contributions',
            content: { services: [], enabled: true }
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

  const saveServices = async (updatedServices: Service[]) => {
    try {
      const { error } = await supabase
        .from('editable_content')
        .upsert([{
          section_key: 'services',
          section_name: 'Services & Contributions',
          content: { services: updatedServices } as any
        }], { onConflict: 'section_key' });

      if (error) throw error;
      setServices(updatedServices);
      toast({ title: "Services updated successfully" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: Service = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      images: formData.images ? formData.images.split('\n').filter(url => url.trim()) : [],
      videos: formData.videos ? formData.videos.split('\n').filter(url => url.trim()) : []
    };
    
    if (editing !== null) {
      const updated = [...services];
      updated[editing] = serviceData;
      saveServices(updated);
    } else {
      saveServices([...services, serviceData]);
    }
    
    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditing(index);
    const service = services[index];
    setFormData({
      title: service.title,
      description: service.description,
      content: service.content,
      images: service.images?.join('\n') || '',
      videos: service.videos?.join('\n') || ''
    });
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    const updated = services.filter((_, i) => i !== index);
    saveServices(updated);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      images: '',
      videos: ''
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
        <h2 className="text-2xl font-bold mb-6">
          {editing !== null ? 'Edit Service' : 'Add New Service'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Detailed Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              placeholder="Write detailed blog-like content about this service..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={3}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videos">Video URLs (one per line)</Label>
            <Textarea
              id="videos"
              value={formData.videos}
              onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
              rows={3}
              placeholder="https://example.com/video1.mp4&#10;https://example.com/video2.mp4"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editing !== null ? 'Update Service' : 'Add Service'}
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
        <h2 className="text-2xl font-bold">All Services</h2>
        {services.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No services yet. Add your first service above.
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-3">{service.description}</p>
                    <p className="text-sm text-foreground/70 mb-2 line-clamp-3">{service.content}</p>
                    {service.images && service.images.length > 0 && (
                      <p className="text-xs text-muted-foreground">📷 {service.images.length} image(s)</p>
                    )}
                    {service.videos && service.videos.length > 0 && (
                      <p className="text-xs text-muted-foreground">🎥 {service.videos.length} video(s)</p>
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

export default ServicesManager;
