import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates');
    
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json({ templates: [] });
    }

    const files = fs.readdirSync(templatesDir);
    const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
    
    const templates = pngFiles.map((pngFile, index) => {
      // Expecting layout to be named somewhat similarly or sequentially, 
      // but the prompt says: "TEMPLATE PHOTO BOOTH 1.PNG -> layout-template-1.json"
      // We can try to extract the number.
      const match = pngFile.match(/\d+/);
      const num = match ? match[0] : (index + 1);
      const layoutFilename = `layout-template-${num}.json`;
      
      let photoCount = 3; // default
      let canvasWidth = 600;
      let canvasHeight = 1800;
      
      // Attempt to read layout to get photoCount
      try {
        const layoutPath = path.join(templatesDir, layoutFilename);
        if (fs.existsSync(layoutPath)) {
          const layoutData = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
          if (layoutData.slotCount) photoCount = layoutData.slotCount;
          if (layoutData.width) canvasWidth = layoutData.width;
          if (layoutData.height) canvasHeight = layoutData.height;
        }
      } catch (e) {
        console.warn(`Could not read layout for ${pngFile}:`, e);
      }

      return {
        id: `local_template_${num}`,
        name: `Photo Booth ${num}`,
        imageUrl: `/templates/${pngFile}`,
        thumbnail: `/templates/${pngFile}`,
        templateImage: `/templates/${pngFile}`,
        layoutFile: `/templates/${layoutFilename}`,
        orientation: 'portrait',
        printSize: '4R',
        category: 'Photo Booth',
        photoCount: photoCount,
        active: true,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
      };
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error reading templates directory:', error);
    return NextResponse.json({ templates: [] }, { status: 500 });
  }
}
