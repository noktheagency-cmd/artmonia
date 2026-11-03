const siteMediaPrefix = "https://mzdcmdvxmonpynssghmw.supabase.co/storage/v1/object/public/site-media/";

export function canOptimizeImage(src: string) {
  return (src.startsWith("/") && !src.startsWith("//")) || src.startsWith(siteMediaPrefix);
}
