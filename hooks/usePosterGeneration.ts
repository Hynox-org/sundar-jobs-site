import html2canvas from "html2canvas";

export interface PosterSize {
  name: string;
  width: number;
  height: number;
}

export const POSTER_SIZES: { [key: string]: PosterSize } = {
  instagram: { name: "Instagram Post", width: 1080, height: 1080 },
  story: { name: "Instagram Story", width: 1080, height: 1920 },
  linkedin: { name: "LinkedIn Post", width: 1200, height: 627 },
  a4: { name: "A4 Print", width: 2480, height: 3508 },
};

export async function generatePosterImage(
  elementRef: HTMLElement,
  width: number,
  height: number,
  quality: "low" | "medium" | "high" = "high",
): Promise<string> {
  const scale = quality === "high" ? 3 : quality === "medium" ? 2 : 1

  const canvas = await html2canvas(elementRef, {
    width,
    height,
    scale,
    allowTaint: true,
    useCORS: true,
    logging: false,
  })

  return canvas.toDataURL("image/png");
}

export async function generatePosterFromElement(
  element: HTMLElement,
  size: PosterSize,
): Promise<string | null> {
  if (!element) {
    console.error("Element to generate poster from is null or undefined.");
    return null;
  }

  try {
    const dataUrl = await generatePosterImage(element, size.width, size.height);
    return dataUrl;
  } catch (error) {
    console.error("Error generating poster image from element:", error);
    return null;
  }
}

export function downloadImage(dataUrl: string, filename: string, format: "png" | "jpg" = "png") {
  const link = document.createElement("a");
  if (format === "jpg") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      link.href = canvas.toDataURL("image/jpeg");
      link.download = `${filename}.jpg`;
      link.click();
    };
    img.src = dataUrl;
  } else {
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
  }
}
