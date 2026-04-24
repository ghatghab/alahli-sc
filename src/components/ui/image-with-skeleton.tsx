import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Class applied to the wrapper (sizing/positioning lives here). */
  wrapperClassName?: string;
};

/**
 * Renders an <img> with a Skeleton placeholder shown until the image
 * finishes loading. Improves perceived performance for media-heavy grids.
 */
export const ImageWithSkeleton = ({
  wrapperClassName,
  className,
  onLoad,
  onError,
  alt,
  ...rest
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative", wrapperClassName)}>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
      <img
        {...rest}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
};

export default ImageWithSkeleton;