// 음식 이미지 원본(food-src/)을 게임 화면에 필요한 크기로 리사이즈 + WebP 변환해 food/에 생성한다.
// 사진을 새로 추가하거나 교체할 때는 food-src/에 원본만 넣고 이 스크립트를 다시 실행하면 된다.
// 사용법: npm run optimize:images
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SRC_DIR = fileURLToPath(new URL('../src/assets/food-src/', import.meta.url))
const OUT_DIR = fileURLToPath(new URL('../src/assets/food/', import.meta.url))

// 화면에서 가장 크게 쓰이는 곳이 w-[30rem](480px)이라, 2배 해상도 화면까지 고려해 960px로 제한한다.
const MAX_WIDTH = 960
const WEBP_QUALITY = 82

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const entries = await readdir(SRC_DIR, { withFileTypes: true })
  const images = entries.filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(extname(e.name).toLowerCase()))

  if (images.length === 0) {
    console.log(`${SRC_DIR}에 원본 이미지가 없어요.`)
    return
  }

  // food/ 안의 기존 .webp를 먼저 비워서, food-src에서 지운 사진이 계속 남아있지 않게 한다.
  const outEntries = await readdir(OUT_DIR, { withFileTypes: true })
  await Promise.all(
    outEntries
      .filter((e) => e.isFile() && extname(e.name).toLowerCase() === '.webp')
      .map((e) => rm(join(OUT_DIR, e.name))),
  )

  let totalBefore = 0
  let totalAfter = 0

  for (const image of images) {
    const srcPath = join(SRC_DIR, image.name)
    const baseName = image.name.replace(extname(image.name), '')
    const outPath = join(OUT_DIR, `${baseName}.webp`)

    const before = (await stat(srcPath)).size
    const buffer = await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer()

    await sharp(buffer).toFile(outPath)

    totalBefore += before
    totalAfter += buffer.length
    console.log(`${image.name} → ${baseName}.webp  (${(before / 1024).toFixed(0)}KB → ${(buffer.length / 1024).toFixed(0)}KB)`)
  }

  console.log(
    `\n총 ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB (${images.length}장)`,
  )
}

main()
