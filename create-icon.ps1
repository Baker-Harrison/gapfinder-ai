Add-Type -AssemblyName System.Drawing

# Create a 1024x1024 bitmap
$bmp = New-Object System.Drawing.Bitmap(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Set high quality rendering
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Fill with primary color (indigo)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(99, 102, 241))
$graphics.FillRectangle($brush, 0, 0, 1024, 1024)

# Draw "GF" text
$font = New-Object System.Drawing.Font('Arial', 300, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
$stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
$rect = New-Object System.Drawing.RectangleF(0, 0, 1024, 1024)
$graphics.DrawString('GF', $font, $textBrush, $rect, $stringFormat)

# Save as PNG
$bmp.Save('app-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graphics.Dispose()
$bmp.Dispose()

Write-Host "Icon created successfully: app-icon.png"
