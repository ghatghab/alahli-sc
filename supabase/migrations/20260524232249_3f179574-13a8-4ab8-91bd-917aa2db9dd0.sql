
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(_email text)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NULL;
  END IF;
  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  RETURN _uid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO authenticated;
