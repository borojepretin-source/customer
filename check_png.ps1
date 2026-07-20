Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('C:\Users\hanif\.gemini\antigravity-ide\scratch\customer_web\public\templates\5.png')

# Find the sprocket holes positions vertically
# Sprocket holes are transparent (A=0) at x=100
Write-Host "=== Finding sprocket hole positions at x=100 (left sprockets) ==="
$holeRanges = @()
$inHole = $false
$holeStart = 0
for ($y = 86; $y -le 1763; $y++) {
    $p = $img.GetPixel(100, $y)
    if ($p.A -lt 50 -and !$inHole) {
        $inHole = $true
        $holeStart = $y
    } elseif ($p.A -ge 50 -and $inHole) {
        $inHole = $false
        $mid = [int](($holeStart + $y) / 2)
        $holeRanges += "y=$holeStart-$($y-1) mid=$mid"
    }
}
Write-Host "Hole ranges: $($holeRanges -join ', ')"

$img.Dispose()
