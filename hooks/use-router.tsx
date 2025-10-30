import { useLoader } from "@/contexts/loader-context";
import { NavigateOptions, PrefetchOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as nextRouter } from "next/navigation";

const useRouter = () => {
  const router = nextRouter();
  const { setLoading } = useLoader();

  const back = () => {
    setLoading(true);
    router.back();
  }

  const forward = () => {
    setLoading(true);
    router.forward();
  }

  const prefetch = (url: string, options?: PrefetchOptions) => {
    router.prefetch(url, options);
  }

  const push = (url: string, options?: NavigateOptions) => {
    setLoading(true);
    router.push(url, options);
  }

  const replace = (url: string, options?: NavigateOptions) => {
    setLoading(true);
    router.replace(url, options);
  }


  const refresh = () => {
    setLoading(true);
    router.refresh() 
  }

  return { back, forward, refresh, replace, push, prefetch };
}

export default useRouter;