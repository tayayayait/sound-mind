-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recordings table for voice recordings
CREATE TABLE public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  audio_url TEXT,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analyses table for AI analysis results
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES public.recordings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  tension_score INTEGER CHECK (tension_score >= 0 AND tension_score <= 100),
  vitality_score INTEGER CHECK (vitality_score >= 0 AND vitality_score <= 100),
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  recovery_score INTEGER CHECK (recovery_score >= 0 AND recovery_score <= 100),
  summary TEXT,
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meditations table for healing content
CREATE TABLE public.meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breathing', 'sleep', 'anxiety', 'focus', 'short')),
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  audio_url TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meditation_sessions table to track user meditation history
CREATE TABLE public.meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  meditation_id UUID NOT NULL REFERENCES public.meditations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Recordings policies
CREATE POLICY "Users can view their own recordings"
ON public.recordings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recordings"
ON public.recordings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recordings"
ON public.recordings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recordings"
ON public.recordings FOR DELETE
USING (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "Users can view their own analyses"
ON public.analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
ON public.analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Meditations policies (public read for everyone)
CREATE POLICY "Everyone can view active meditations"
ON public.meditations FOR SELECT
USING (is_active = true);

-- Meditation sessions policies
CREATE POLICY "Users can view their own meditation sessions"
ON public.meditation_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meditation sessions"
ON public.meditation_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation sessions"
ON public.meditation_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at
BEFORE UPDATE ON public.recordings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert sample meditation content
INSERT INTO public.meditations (title, description, duration_seconds, category, difficulty, audio_url, thumbnail_url) VALUES
('3분 호흡 명상', '짧은 시간에 마음을 가라앉히는 호흡 명상입니다. 바쁜 일상 중에도 잠시 멈춰 자신을 돌보세요.', 180, 'breathing', 'beginner', NULL, NULL),
('깊은 수면을 위한 가이드', '편안한 수면을 위한 15분 명상입니다. 하루의 긴장을 풀고 평화로운 밤을 맞이하세요.', 900, 'sleep', 'beginner', NULL, NULL),
('불안 완화 명상', '마음의 불안을 가라앉히는 10분 명상입니다. 부드러운 음성이 안정감을 선사합니다.', 600, 'anxiety', 'intermediate', NULL, NULL),
('집중력 향상 명상', '업무나 학습 전 집중력을 높이는 5분 명상입니다.', 300, 'focus', 'beginner', NULL, NULL),
('5분 마음 챙김', '하루 중 언제든 할 수 있는 짧은 마음 챙김 명상입니다.', 300, 'short', 'beginner', NULL, NULL),
('아침 시작 명상', '활기찬 하루를 시작하는 10분 아침 명상입니다.', 600, 'breathing', 'beginner', NULL, NULL),
('스트레스 해소 명상', '긴장된 몸과 마음을 풀어주는 15분 명상입니다.', 900, 'anxiety', 'intermediate', NULL, NULL),
('깊은 이완 명상', '온몸의 긴장을 풀어주는 20분 명상입니다.', 1200, 'sleep', 'advanced', NULL, NULL);