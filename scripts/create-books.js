const fsPromises = require('fs').promises
const fs = require('fs')
const path = require('path')
const https = require('https')

const CONTENT_DIR = path.join(process.cwd(), 'content', 'library')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'books')

// Ensure directories exist
async function ensureDirectories() {
  await fsPromises.mkdir(CONTENT_DIR, { recursive: true })
  await fsPromises.mkdir(IMAGES_DIR, { recursive: true })
}

// Download image and detect format
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`))
        return
      }

      const contentType = response.headers['content-type']
      let extension = 'jpg' // default extension

      if (contentType) {
        if (contentType.includes('webp')) {
          extension = 'webp'
        } else if (contentType.includes('png')) {
          extension = 'png'
        }
      }

      const finalFilepath = `${filepath}.${extension}`
      const fileStream = fs.createWriteStream(finalFilepath)

      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        resolve(finalFilepath)
      })

      fileStream.on('error', (err) => {
        fs.unlink(finalFilepath, () => {
          reject(err)
        })
      })
    }).on('error', reject)
  })
}

// Create slug from title with Polish characters support
function createSlug(title) {
  const polishChars = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
    'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
  }
  
  return title
    .toLowerCase()
    .split('')
    .map(char => polishChars[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Parse TSV data
function parseTsv(data) {
  const lines = data.trim().split('\n')
  const headers = lines[0].split('\t')
  
  return lines.slice(1).map(line => {
    const values = line.split('\t')
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : ''
      return obj
    }, {})
  })
}

// Create MDX file
async function createMdxFile(book, imageFilename = null) {
  const slug = createSlug(book.Title)
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`)

  const mdxContent = `---
title: "${book.Title}"
author: "${book.Author || ''}"
published: true
status: "read"
date: "${book.Date}"
bookType: "${book.Type}"
tag: "${book.Tag || ''}"
cover: "${imageFilename ? `/books/${imageFilename}` : book.Cover}"
---
`

  await fsPromises.writeFile(mdxPath, mdxContent, 'utf-8')
}

// Process single book
async function processBook(book) {
  const slug = createSlug(book.Title)
  const imagePath = path.join(IMAGES_DIR, slug)

  try {
    // Try to download image
    const finalImagePath = await downloadImage(book.Cover, imagePath)
    const imageFilename = path.basename(finalImagePath)
    
    // Create MDX with downloaded image
    await createMdxFile(book, imageFilename)
    console.log(`✅ Processed: ${book.Title}`)
  } catch (error) {
    // Create MDX with original image URL if download fails
    await createMdxFile(book)
    console.log(`⚠️ Processed with original image URL: ${book.Title} (${error.message})`)
  }
}

// Main function
async function main() {
  try {
    await ensureDirectories()

    // Read TSV data
    const tsvData = await fsPromises.readFile('books.tsv', 'utf-8')
    const records = parseTsv(tsvData)

    // Process all books
    for (const book of records) {
      if (book.Title && book.Cover) {
        await processBook(book)
      }
    }

    console.log('🎉 All books processed!')
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main() 