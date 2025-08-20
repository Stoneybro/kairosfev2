export function normalizeSignature(resp: unknown): `0x${string}` {
    if (!resp) throw new Error("no signature");
    if (typeof resp === "object" && resp !== null) {
      if ("result" in (resp as any) && typeof (resp as any).result === "string") return normalizeSignature((resp as any).result);
      if ("signature" in (resp as any) && typeof (resp as any).signature === "string") return normalizeSignature((resp as any).signature);
      if ("r" in (resp as any) && "s" in (resp as any) && "v" in (resp as any)) {
        const r = String((resp as any).r).replace(/^0x/, "").padStart(64, "0");
        const s = String((resp as any).s).replace(/^0x/, "").padStart(64, "0");
        let v: number = typeof (resp as any).v === "string" ? parseInt((resp as any).v, 16) : Number((resp as any).v);
        if (v < 27) v += 27;
        return ("0x" + r + s + v.toString(16).padStart(2, "0")) as `0x${string}`;
      }
    }
    if (typeof resp === "string") {
      let s = resp.startsWith("0x") ? resp.slice(2) : resp;
      if (s.length === 130) return ("0x" + s) as `0x${string}`;
      if (s.length === 128) return ("0x" + s + "1b") as `0x${string}`;
      if (s.length === 132) {
        const last4 = s.slice(-4);
        if (last4.slice(0,2) === last4.slice(2,4)) s = s.slice(0, -2);
        if (s.length === 130) return ("0x" + s) as `0x${string}`;
        s = s.slice(-130);
        return ("0x" + s) as `0x${string}`;
      }
      if (s.length > 130) return ("0x" + s.slice(-130)) as `0x${string}`;
    }
    throw new Error("unexpected signature shape");
  }

  const CURVE_N: bigint = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
  const HALF_N: bigint = CURVE_N / 2n;
  
export  function normalizeAndCanonicalizeSignature(resp: unknown): `0x${string}` {
    if (!resp) throw new Error("no signature");
  
    // unwrap common wrappers
    if (typeof resp === "object" && resp !== null) {
      if ("result" in (resp as any) && typeof (resp as any).result === "string")
        return normalizeAndCanonicalizeSignature((resp as any).result);
      if ("signature" in (resp as any) && typeof (resp as any).signature === "string")
        return normalizeAndCanonicalizeSignature((resp as any).signature);
      if ("r" in (resp as any) && "s" in (resp as any) && "v" in (resp as any)) {
        let r = String((resp as any).r).replace(/^0x/, "").padStart(64, "0");
        let s = String((resp as any).s).replace(/^0x/, "").padStart(64, "0");
        let v = (resp as any).v;
        if (typeof v === "string") v = parseInt(v, 16);
        if (typeof v === "number" && v < 27) v = v + 27;
        let sig = r + s + v.toString(16).padStart(2, "0");
        return canonicalizeHex(sig);
      }
    }
  
    if (typeof resp === "string") {
      let s = resp.startsWith("0x") ? resp.slice(2) : resp;
      if (s.length === 128) s = s + "1b"; // r||s -> add default v
      if (s.length === 132) {
        // handle duplicated v e.g. ...1b1b
        const last4 = s.slice(-4);
        if (last4.slice(0,2) === last4.slice(2,4)) s = s.slice(0, -2);
      }
      if (s.length > 130) s = s.slice(-130);
      if (s.length !== 130) throw new Error("unexpected signature length after normalization");
      return canonicalizeHex(s);
    }
  
    throw new Error("unexpected signature shape");
  }
  
  function canonicalizeHex(rsVhex: string): `0x${string}` {
    // rsVhex is 130 hex chars (r:64 + s:64 + v:2)
    const r = rsVhex.slice(0, 64);
    let s = BigInt("0x" + rsVhex.slice(64, 128));
    let v = parseInt(rsVhex.slice(128, 130), 16);
    // normalize v to 27/28
    if (v < 27) v += 27;
    // canonicalize s if it's in upper half
    if (s > HALF_N) {
      s = CURVE_N - s;
      // flip v bit (27 <-> 28)
      v = v ^ 1;
    }
    const shex = s.toString(16).padStart(64, "0");
    const vhex = v.toString(16).padStart(2, "0");
    return ("0x" + r + shex + vhex) as `0x${string}`;
  }