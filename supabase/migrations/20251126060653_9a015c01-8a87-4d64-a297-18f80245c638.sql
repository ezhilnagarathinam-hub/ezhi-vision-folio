-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create editable_content table for all site sections
CREATE TABLE public.editable_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.editable_content ENABLE ROW LEVEL SECURITY;

-- Insert default content sections
INSERT INTO public.editable_content (section_key, section_name, content) VALUES
('hero', 'Hero Section', jsonb_build_object(
  'name', 'Ezhil',
  'role', 'Founder, EA Dream Supporters',
  'description', 'Educationist • Entrepreneur • Productivity Mentor. Helping students achieve their dream exams with scientific preparation management.'
)),
('about', 'About Section', jsonb_build_object(
  'text', 'Ezhil is the founder of EA Dream Supporters, an EdTech startup transforming competitive exam preparation through structured preparation management, personalized scheduling, and scientific productivity systems. Known for simplicity, clarity, and high-impact execution, Ezhil helps aspirants reduce preparation timelines and stay focused.',
  'highlights', jsonb_build_array(
    'Simple and disciplined life approach',
    'Deep interest in cultures & global knowledge',
    'Love for teaching and mentoring',
    'Mission-driven entrepreneur',
    'Author & content creator',
    'Student-first mindset'
  )
)),
('mission', 'Mission', jsonb_build_object(
  'text', 'To help every student learn smarter, prepare better, and achieve their dream exam with confidence.'
)),
('vision', 'Vision', jsonb_build_object(
  'text', 'To make preparation management a standard system for all competitive exams in India.'
)),
('contact', 'Contact Info', jsonb_build_object(
  'instagram', 'https://instagram.com',
  'youtube', 'https://youtube.com',
  'telegram', 'https://telegram.org',
  'whatsapp', 'https://whatsapp.com',
  'email', 'contact@eadreamsupporters.com'
));

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for posts (public read, admin write)
CREATE POLICY "Anyone can view published posts"
  ON public.posts FOR SELECT
  TO authenticated, anon
  USING (published = true);

CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for editable_content (public read, admin write)
CREATE POLICY "Anyone can view content"
  ON public.editable_content FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can update content"
  ON public.editable_content FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.editable_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();