export type FabricOption = {
  id: string;
  name: string;
  hex: string;
  swatchPath: string;
  promptHint: string;
};

export const FABRIC_OPTIONS: FabricOption[] = [
  {
    id: "anholt-02",
    name: "Anholt 02",
    hex: "#D8E2E7",
    swatchPath: "/swatches/Anholt_02.jpg",
    promptHint:
      "Close-up macro of a tightly woven basket-weave upholstery textile. Base color is cool off-white/light grey with a slightly blue cast. Irregular black/charcoal slub threads form subtle vertical + horizontal streaks, creating a lightly speckled grid. Texture is crisp and structured (not fuzzy), with visible woven blocks and small raised knots. Even studio lighting, sharp detail, no pattern besides the weave.",
  },
  {
    id: "barry-24",
    name: "Barry 24",
    hex: "#7E464E",
    swatchPath: "/swatches/Barry_24.jpg",
    promptHint:
      "Close-up macro of a coarse, nubby woven upholstery fabric in deep burgundy/wine (red-brown) with subtle tonal variation. Surface is pebbly and tactile with small loops and irregular yarn thickness. No stripes or geometric motif—just organic texture and depth from the weave. Slight sheen is minimal; overall matte, warm, and heavy-duty. Even lighting, high sharpness, visible fibers.",
  },
  {
    id: "ferby-10",
    name: "Ferby 10",
    hex: "#3D3D44",
    swatchPath: "/swatches/Ferby_10.jpg",
    promptHint:
      "Close-up macro of a dark charcoal/graphite striped upholstery textile. Repeating vertical bands with alternating textures: darker fuzzy ribs and narrower dotted pinstripes in muted blue-grey. Strong linear direction, tight spacing, and a structured look (like a modern contract fabric). Fibers are short and slightly fuzzy; contrast is subtle but clearly striped. Neutral studio lighting, very sharp detail.",
  },
  {
    id: "ferby-22",
    name: "Ferby 22",
    hex: "#5F3333",
    swatchPath: "/swatches/Ferby_22.jpg",
    promptHint:
      "Close-up macro of a ribbed corduroy-style upholstery fabric in brick red/oxblood. Clear vertical ribs/wales running top-to-bottom with a soft pile; valleys between ribs are slightly darker, giving depth. Texture looks plush and tactile with visible individual fibers along the ribs. Overall matte with mild directional shading from the nap. Even studio lighting, crisp macro focus.",
  },
  {
    id: "moss-2007",
    name: "MOSS 2007",
    hex: "#35242C",
    swatchPath: "/swatches/MOSS_2007.jpg",
    promptHint:
      "Close-up macro of plush velvet/velour fabric in very dark aubergine (near-black wine). Smooth dense pile with subtle directional nap creating soft tonal waves; no visible weave grid, just velvety surface. Tiny lint/fiber flecks may be visible, but overall luxurious and uniform. Low-to-medium sheen that catches light softly. Studio lighting, high detail, rich dark color.",
  },
  {
    id: "skt-thomas-25",
    name: "Skt. Thomas 25",
    hex: "#B9B9B2",
    swatchPath: "/swatches/Skt.-Thomas_25.jpg",
    promptHint:
      "Close-up macro of a looped bouclé upholstery fabric in warm oatmeal/greige. Dense small loops and knots create a bumpy, cozy texture with subtle tonal flecks (beige + light grey). No stripes; the interest comes from the looped yarn structure and irregular surface. Looks soft, thick, and comfortable with a matte finish. Even studio lighting, sharp texture detail.",
  },
];

export function getFabricById(id: string): FabricOption | undefined {
  return FABRIC_OPTIONS.find((fabric) => fabric.id === id);
}
