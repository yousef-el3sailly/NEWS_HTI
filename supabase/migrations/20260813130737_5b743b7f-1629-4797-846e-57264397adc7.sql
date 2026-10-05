DROP POLICY "news_select_published" ON public.news;
CREATE POLICY "news_select_anon" ON public.news FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "news_select_auth" ON public.news FOR SELECT TO authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;