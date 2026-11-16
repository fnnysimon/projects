# Tiny static server with live reload. No Node/Python needed.
# Usage: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 4321]
param([int]$Port = 4321)

$site = Join-Path $PSScriptRoot 'site'
$siteFull = [IO.Path]::GetFullPath($site)

$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'; '.json' = 'application/json'
  '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'
  '.gif' = 'image/gif'; '.ico' = 'image/x-icon'; '.woff2' = 'font/woff2'
}

# Injected into every HTML page: polls for file changes and reloads.
$reloadSnippet = @'
<script>
(function () {
  var last = null;
  setInterval(function () {
    fetch('/__livereload', { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (v) { if (last === null) last = v; else if (v !== last) location.reload(); })
      .catch(function () {});
  }, 400);
})();
</script>
'@

function Get-SiteStamp {
  $files = Get-ChildItem -Path $site -Recurse -File
  $max = ($files | ForEach-Object { $_.LastWriteTimeUtc.Ticks } | Measure-Object -Maximum).Maximum
  "$max-$($files.Count)"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Nimbus running at http://localhost:$Port/  (live reload on, Ctrl+C to stop)"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $res.Headers['Cache-Control'] = 'no-store'
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)

    if ($path -eq '/__livereload') {
      $bytes = [Text.Encoding]::UTF8.GetBytes((Get-SiteStamp))
      $res.ContentType = 'text/plain'
    }
    else {
      if ($path.EndsWith('/')) { $path += 'index.html' }
      $file = [IO.Path]::GetFullPath((Join-Path $site $path.TrimStart('/')))
      if (-not $file.StartsWith($siteFull, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $file -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
        $res.ContentType = 'text/plain'
      }
      else {
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        if ($ext -eq '.html') {
          $html = [IO.File]::ReadAllText($file)
          if ($html -match '</body>') { $html = $html -replace '</body>', ($reloadSnippet + '</body>') }
          else { $html += $reloadSnippet }
          $bytes = [Text.Encoding]::UTF8.GetBytes($html)
        }
        else {
          $bytes = [IO.File]::ReadAllBytes($file)
        }
      }
    }
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  }
  catch {
    Write-Host "Error: $_"
    try { $res.StatusCode = 500 } catch {}
  }
  finally {
    $res.OutputStream.Close()
  }
}
