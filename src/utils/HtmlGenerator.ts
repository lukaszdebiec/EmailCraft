import { type EmailBlock } from '../types.ts';

export const generateEmailHtml = (blocks: EmailBlock[]): string => {
  const renderedBlocks = blocks.map(block => renderBlockToHtml(block)).join('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Template</title>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f1f5f9; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        
        @media screen and (max-width: 600px) {
            .main-table { width: 100% !important; }
            .column { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f1f5f9;">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f1f5f9;">
            <tr>
                <td align="center">
                    <!-- Main Container -->
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="main-table" style="background-color: #ffffff; margin: 40px 0;">
                        ${renderedBlocks}
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
  `.trim();
};

const renderBlockToHtml = (block: EmailBlock): string => {
  const style = block.style;
  const outerStyle = `
    background-color: ${style.blockBackgroundColor || '#ffffff'};
    padding: ${style.padding || '0px'};
    text-align: ${style.textAlign || 'left'};
  `.replace(/\s+/g, ' ').trim();

  const innerStyle = `
    display: ${(style.width && style.width !== '100%') || block.type === 'button' ? 'inline-block' : 'block'};
    width: ${style.width || '100%'};
    background-color: ${block.type !== 'button' ? style.backgroundColor : 'transparent'};
    border-radius: ${style.borderRadius || '0px'};
    color: ${style.color || '#000000'};
  `.replace(/\s+/g, ' ').trim();

  return `
    <tr>
        <td align="${style.textAlign || 'left'}" style="${outerStyle}">
            <table border="0" cellpadding="0" cellspacing="0" width="${style.width || '100%'}" style="${innerStyle}">
                <tr>
                    <td style="padding: 0;">
                        ${renderBlockContent(block)}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;
};

const renderBlockContent = (block: EmailBlock): string => {
  switch (block.type) {
    case 'text':
      return `<div style="font-family: Arial, sans-serif; font-size: ${block.style.fontSize || '16px'}; line-height: 1.5; padding: 20px;">${block.content}</div>`;
    
    case 'image':
      return `<img src="${block.content || 'https://placehold.co/600x200'}" width="100%" style="display: block; width: 100%; height: auto;" />`;
    
    case 'button':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" bgcolor="${block.style.backgroundColor || '#6366f1'}" style="border-radius: ${block.style.borderRadius || '4px'};">
                                <a href="${block.url || '#'}" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 16px; color: ${block.style.color || '#ffffff'}; text-decoration: none; font-weight: bold;">
                                    ${block.content}
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
      `;
    
    case 'spacer':
      return `<div style="height: ${block.style.height || '20px'}; line-height: ${block.style.height || '20px'}; font-size: 1px;">&nbsp;</div>`;
    
    case 'divider':
      return `<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />`;

    case 'social':
      const links = block.socialLinks?.filter(l => l.active).map(link => `
        <td style="padding: 0 6px;">
            <a href="${link.url}" target="_blank">
                <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/${link.platform}.png" width="${block.style.iconSize || '24'}" height="${block.style.iconSize || '24'}" style="display: block;" />
            </a>
        </td>
      `).join('') || '';
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="${block.style.textAlign || 'center'}" style="padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>${links}</tr>
                    </table>
                </td>
            </tr>
        </table>
      `;

    case 'menu':
      const menuItems = block.menuItems?.map(item => `
        <td style="padding: 0 ${parseInt(block.style.itemSpacing || '20') / 2}px;">
            <a href="${item.url}" target="_blank" style="font-family: Arial, sans-serif; font-size: ${block.style.fontSize || '14px'}; color: ${block.style.color || '#6366f1'}; text-decoration: none; font-weight: 500;">
                ${item.label}
            </a>
        </td>
      `).join('') || '';
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="${block.style.textAlign || 'center'}" style="padding: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>${menuItems}</tr>
                    </table>
                </td>
            </tr>
        </table>
      `;

    case 'hero':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-image: url('${block.heroData?.backgroundImage}'); background-size: cover; background-position: center; background-color: ${block.heroData?.overlayColor || '#000000'};">
            <tr>
                <td align="center" style="padding: ${block.style.padding || '40px'}; background-color: ${hexToRgba(block.heroData?.overlayColor || '#000000', block.heroData?.overlayOpacity || 0.4)};">
                    <h1 style="font-family: Arial, sans-serif; font-size: 40px; color: ${block.style.color || '#ffffff'}; margin: 0 0 10px 0;">${block.heroData?.title}</h1>
                    <p style="font-family: Arial, sans-serif; font-size: 18px; color: ${block.style.color || '#ffffff'}; margin: 0 0 20px 0;">${block.heroData?.subtitle}</p>
                    ${block.heroData?.buttonText ? `
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" bgcolor="${block.style.backgroundColor || '#6366f1'}" style="border-radius: ${block.style.borderRadius || '4px'};">
                                    <a href="${block.heroData.buttonUrl}" target="_blank" style="display: inline-block; padding: 12px 32px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold;">
                                        ${block.heroData.buttonText}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    ` : ''}
                </td>
            </tr>
        </table>
      `;

    case 'video':
        return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="position: relative;">
                    <a href="${block.videoData?.videoUrl}" target="_blank" style="display: block; position: relative; text-decoration: none;">
                        <img src="${block.videoData?.thumbnailUrl}" width="100%" style="display: block; width: 100%; height: auto; border-radius: ${block.style.borderRadius || '4px'};" />
                        <!-- Fallback Play Button for all clients -->
                        <div style="position: absolute; top: 50%; left: 50%; margin-top: -32px; margin-left: -32px; width: 64px; height: 64px; background-color: ${block.videoData?.playButtonColor || '#ef4444'}; border-radius: 50%; color: #ffffff; line-height: 64px; text-align: center; font-size: 30px;">▶</div>
                    </a>
                </td>
            </tr>
        </table>
      `;

    case 'row':
        const columns = block.columns?.map(col => `
            <td class="column" width="${col.width}" valign="top" style="width: ${col.width};">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${col.blocks.map(b => renderBlockToHtml(b)).join('')}
                </table>
            </td>
        `).join('') || '';
        return `
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>${columns}</tr>
            </table>
        `;

    default:
      return '';
  }
};

// Helper for RGBA conversion in Hero overlay
function hexToRgba(hex: string, opacity: number) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r},${g},${b},${opacity})`;
}
