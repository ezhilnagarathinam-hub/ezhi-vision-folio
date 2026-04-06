UPDATE editable_content 
SET content = jsonb_build_object(
  'instagram', content->>'instagram',
  'youtube', content->>'youtube',
  'linkedin', content->>'whatsapp',
  'email', content->>'email'
)
WHERE section_key = 'contact';