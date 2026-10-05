# Servidor Web local nativo de Windows (PowerShell) - No requiere instalar nada
$Port = 3000
$Root = $PSScriptRoot

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Prefixes.Add("http://127.0.0.1:$Port/")

# Intentar registrar IP de red local
$IpAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -ne "127.0.0.1" -and $_.InterfaceAlias -notmatch "vEthernet|Loopback" }
foreach ($ip in $IpAddresses) {
    try {
        $Listener.Prefixes.Add("http://$($ip.IPAddress):$Port/")
    } catch {}
}

try {
    $Listener.Start()
} catch {
    # Si falla por permisos de prefijo con IP, iniciar solo con localhost
    $Listener = New-Object System.Net.HttpListener
    $Listener.Prefixes.Add("http://localhost:$Port/")
    $Listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "🏁 SERVIDOR LOCAL STAND (POWERShell NATIVO)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "URL Local: http://localhost:$Port/index.html" -ForegroundColor Green
Write-Host "Panel TV:  http://localhost:$Port/admin.html" -ForegroundColor Green
Write-Host "`n📱 Para Tablets y Celulares en el Stand:" -ForegroundColor White

foreach ($ip in $IpAddresses) {
    Write-Host "  ➔ http://$($ip.IPAddress):$Port/index.html" -ForegroundColor Yellow
}

Write-Host "`nPresione Ctrl + C para detener el servidor." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Yellow

$Mimes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".svg"  = "image/svg+xml"
}

while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response

    $UrlPath = $Request.Url.LocalPath
    if ($UrlPath -eq "/" -or $UrlPath -eq "") {
        $UrlPath = "/index.html"
    }

    $FilePath = Join-Path $Root $UrlPath.TrimStart('/')

    if (Test-Path $FilePath -PathType Leaf) {
        $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
        $ContentType = if ($Mimes.ContainsKey($Ext)) { $Mimes[$Ext] } else { "application/octet-stream" }
        
        $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
        $Response.ContentType = $ContentType
        $Response.ContentLength64 = $Bytes.Length
        $Response.AddHeader("Cache-Control", "no-cache")
        $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        $Response.Close()
    } else {
        $Response.StatusCode = 404
        $Response.Close()
    }
}
