-- down: acquisition_targets rollback
DROP TRIGGER IF EXISTS trg_acq_updated_at ON public.acquisition_targets;
DROP TABLE IF EXISTS public.acquisition_targets;
-- Note: set_updated_at() function is shared — do not drop it here.
