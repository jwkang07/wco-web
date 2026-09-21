import { chromium } from "playwright";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const work = join(root, ".tmp", "pptx-edit");
const htmlPath = join(work, "homepage-mockup.html");
const pngPath = join(work, "homepage-mockup.png");
const extracted = join(work, "extracted");
const outputPptx =
  "c:\\Users\\gram\\Documents\\카카오톡 받은 파일\\우리챔버오케스트라 홈페이지 메인화면 수정.pptx";
const backupPptx = join(work, "backup-original.pptx");

function safeCopy(src, dest) {
  try {
    copyFileSync(src, dest);
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "EBUSY") {
      return false;
    }
    throw error;
  }
}

mkdirSync(work, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
await page.screenshot({ path: pngPath, fullPage: true });
await browser.close();

if (existsSync(outputPptx)) {
  if (!safeCopy(outputPptx, backupPptx)) {
    console.warn("Backup skipped (file open):", outputPptx);
  }
}
copyFileSync(pngPath, join(extracted, "ppt", "media", "image1.png"));

const cleanSlide = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="메인화면 수정안"/>
          <p:cNvPicPr>
            <a:picLocks noChangeAspect="1"/>
          </p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId2"/>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="9144000" cy="6858000"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>
`;

writeFileSync(join(extracted, "ppt", "slides", "slide1.xml"), cleanSlide, "utf8");

const zipPath = join(work, "output.zip");
const pptxPath = join(work, "output.pptx");
rmSync(zipPath, { force: true });
rmSync(pptxPath, { force: true });

execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${join(extracted, '*')}' -DestinationPath '${zipPath}' -Force"`,
  { stdio: "inherit" },
);

copyFileSync(zipPath, pptxPath);

const altPptx = outputPptx.replace(/\.pptx$/i, " (수정완료).pptx");
if (!safeCopy(pptxPath, outputPptx)) {
  copyFileSync(pptxPath, altPptx);
  console.log("Target file is open. Saved instead:", altPptx);
} else {
  console.log("Updated:", outputPptx);
}

console.log("Work copy:", pptxPath);
if (existsSync(backupPptx)) {
  console.log("Backup:", backupPptx);
}
