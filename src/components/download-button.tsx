"use client";

import { createClient } from "@/lib/supabase/client";

type Props = {
  assetId: string;
  href: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Download link that also bumps the asset's download counter (fire-and-forget
 * via the public increment_download RPC).
 */
export function DownloadButton({ assetId, href, className, children }: Props) {
  function handleClick() {
    const supabase = createClient();
    // don't block the download on the counter
    void supabase.rpc("increment_download", { asset_id: assetId });
  }

  return (
    <a href={href} download onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
