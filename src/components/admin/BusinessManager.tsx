import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, Upload, X } from 'lucide-react';

interface Business {
  name: string;
  description: string;
  website: string;
  logo: string;
}

const BusinessManager = () => {
  const [enabled, setEnabled] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo: ''
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
        .eq('section_key', 'business')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const content = data.content as { businesses?: Business[]; enabled?: boolean };
        setBusinesses(content.businesses || []);
        setEnabled(content.enabled !== false);
      } else {
        // Create initial record if it doesn't exist
        await supabase
          .from('editable_content')
          .insert([{
            section_key: 'business',
            section_name: 'My Business',
            content: { businesses: [] }
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

  const saveBusinesses = async (updatedBusinesses: Business[]) => {
    try {
      const { error } = await supabase
        .from('editable_content')
        .upsert([{
          section_key: 'business',
          section_name: 'My Business',
          content: { businesses: updatedBusinesses } as any
        }], { onConflict: 'section_key' });

      if (error) throw error;
      setBusinesses(updatedBusinesses);
      toast({ title: "Business updated successfully" });
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
    
    if (editing !== null) {
      const updated = [...businesses];
      updated[editing] = formData;
      saveBusinesses(updated);
    } else {
      saveBusinesses([...businesses, formData]);
    }
    
    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditing(index);
    setFormData(businesses[index]);
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    
    const updated = businesses.filter((_, i) => i !== index);
    saveBusinesses(updated);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      logo: ''
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
          {editing !== null ? 'Edit Business' : 'Add New Business'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (2 lines max)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editing !== null ? 'Update Business' : 'Add Business'}
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
        <h2 className="text-2xl font-bold">All Businesses</h2>
        {businesses.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No businesses yet. Add your first business above.
          </Card>
        ) : (
          <div className="grid gap-4">
            {businesses.map((business, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {business.logo && (
                      <img 
                        src={business.logo} 
                        alt={business.name}
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{business.name}</h3>
                      <p className="text-muted-foreground mb-2">{business.description}</p>
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {business.website}
                      </a>
                    </div>
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

export default BusinessManager;
