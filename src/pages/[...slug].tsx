// pages/[[...slug]].tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CatchAllRoute: React.FC = () => {
  const router = useRouter();
  const { slug = [] } = router.query;
  const act_slug: string = slug[0] as string;  

  console.log(act_slug);
  useEffect(() => {
    if( act_slug ) {
      window.location.href = "https://vakphsnnqnhsihwlcdkz.supabase.co/functions/v1/shortnr-redirect/" + act_slug;
    }
  }, [act_slug]);

  return null;
}

export default CatchAllRoute;
